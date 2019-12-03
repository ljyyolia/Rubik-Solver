import os

import sys
import numpy as np
import pickle as pickle
import time

from multiprocessing import Process, Queue

#sys.path.append('./')

from ..environments import env_utils

Environment = env_utils.getEnvironment('cube3')

import gc

from ..ml_utils import nnet_utils
from ..ml_utils import search_utils

import threading
import inspect
import ctypes
 
def _async_raise(tid, exctype):
    """raises the exception, performs cleanup if needed"""
    tid = ctypes.c_long(tid)
    if not inspect.isclass(exctype):
        exctype = type(exctype)
    res = ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, ctypes.py_object(exctype))
    if res == 0:
        raise ValueError("invalid thread id")
    elif res != 1:
        # """if it returns a number greater than one, you're in trouble,
        # and you should call it again with exc=NULL to revert the effect"""
        ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, None)
        raise SystemError("PyThreadState_SetAsyncExc failed")
 
def stop_thread(thread):
    _async_raise(thread.ident, SystemExit)


class MyThread(threading.Thread):

    def __init__(self,func,args=()):
        super(MyThread,self).__init__()
        self.func = func
        self.args = args

    def run(self):
        self.result = self.func(*self.args)

    def get_result(self):
        try:
            return self.result
        except Exception:
            return None

def validSoln(state,soln,Environment):
    solnState = state
    for move in soln:
        solnState = Environment.next_state(solnState,move)

    return(Environment.checkSolved(solnState))

def dataListener(dataQueue,resQueue, gpuNum=None, useGPU=True):
    from os import path
    d = path.dirname(__file__)
    parent_path = os.path.dirname(d)
    model_loc = os.path.join(parent_path, 'savedModels/cube3/1/')
    #model_loc = '.savedModels/cube3/1/'
    model_name = 'model.meta'
    nnet = nnet_utils.loadNnet(model_loc, model_name,useGPU,Environment,gpuNum=gpuNum)
    while True:
        data = dataQueue.get()
        nnetResult = nnet(data)
        resQueue.put(nnetResult)

### Load nnet

if len(os.environ['CUDA_VISIBLE_DEVICES']) > 1:
    gpuNums = [int(x) for x in os.environ['CUDA_VISIBLE_DEVICES'].split(",")]
else:
    gpuNums = [None]
numParallel = len(gpuNums)

useGPU = True

dataQueues = []
resQueues = []
for num in range(numParallel):
    dataQueues.append(Queue(1))
    resQueues.append(Queue(1))

    dataListenerProc = Process(target=dataListener, args=(dataQueues[num],resQueues[num],gpuNums[num],useGPU,))
    dataListenerProc.daemon = True
    dataListenerProc.start()

def heuristicFn_nnet(x):
    ### Write data
    parallelNums = list(range(min(numParallel,x.shape[0])))
    splitIdxs = np.array_split(np.arange(x.shape[0]),len(parallelNums))
    for num in parallelNums:
        dataQueues[num].put(x[splitIdxs[num]])

        ### Check until all data is obtaied
    results = [None]*len(parallelNums)
    for num in parallelNums:
        results[num] = resQueues[num].get()

    results = np.concatenate(results)

    return(results)

### Get solutions

def run_nnet(state, nnet_parallel = 100, depth_penalty = 0.2, bfs = 0):
    stateStr = " ".join([str(x) for x in state])
    #print(stateStr)
    start_time = time.time()
    BestFS_solve = search_utils.BestFS_solve([state],heuristicFn_nnet,Environment, bfs = bfs)
    isSolved, solveSteps, nodesGenerated_num = BestFS_solve.run(numParallel = nnet_parallel,depthPenalty = depth_penalty,verbose = False)
    BestFS_solve = []
    del BestFS_solve
    gc.collect()

    soln = solveSteps[0]
    nodesGenerated_num = nodesGenerated_num[0]
    elapsedTime = time.time() - start_time
    
    data = dict()
    data["state"] = state
    
    data["time"] = elapsedTime
    data["nodesGenerated_num"] = nodesGenerated_num
    
    assert(validSoln(state,soln,Environment))

    data["solution"] = soln

    return data

def solveState(state):
    data = run_nnet(state)
    solveStr = ", ".join(["len/time/#nodes - %i/%.2f/%i" % (len(data["solution"]),data["time"],data["nodesGenerated_num"])])
    print("State: %s" % (solveStr), file=sys.stderr)
    print(data['state'])
    print(data["solution"])

def solve_state(state, wait_time = 5, nnet_parallel = 100, depth_penalty = 0.2, bfs = 0):
    t = MyThread(run_nnet, (state, nnet_parallel, depth_penalty, bfs,))
    t.start()
    t.join(wait_time)
    data = t.get_result()
    if data == None:
        stop_thread(t)
        return False, data
    else:
        return True, data

    
'''
if __name__ == '__main__':
    filename = '../data/cube3/states.pkl'
    inputData = pickle.load(open(filename,"rb"), encoding='iso-8859-1')
    states = inputData['states']
    #for state in states:
    #    solveState(state)
    testState = np.array([0, 1, 8, 3, 4, 12, 11, 41, 6, 
                          17, 10, 42, 32, 13, 34, 2, 14, 36, 
                          27, 19, 38, 21, 22, 23, 18, 25, 26,
                          33, 28, 24, 48, 31, 5, 20, 16, 53,
                          44, 30, 29, 7, 40, 39, 51, 43, 35,
                          9, 46, 47, 37, 49, 50, 15, 52, 45])
    testState = np.array([53,43,51,50,4,48,47,37,45,36,46,38,39,13,41,42,52,44,33,10,27,25,22,19,35,16,29,20,7,26,28,31,34,18,1,24,9,23,11,12,40,14,15,21,17,8,30,6,5,49,3,2,32,0])
    solveState(testState)
'''