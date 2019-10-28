import os

import sys
import numpy as np
import pickle as pickle
import time

from multiprocessing import Process, Queue

sys.path.append('./')

from environments import env_utils

import gc

def validSoln(state,soln,Environment):
    solnState = state
    for move in soln:
        solnState = Environment.next_state(solnState,move)

    return(Environment.checkSolved(solnState))

def dataListener(dataQueue,resQueue,gpuNum=None):
    model_loc = 'savedModels/cube3/1/'
    model_name = 'model.meta'
    nnet = nnet_utils.loadNnet(model_loc, model_name,useGPU,Environment,gpuNum=gpuNum)
    while True:
        data = dataQueue.get()
        nnetResult = nnet(data)
        resQueue.put(nnetResult)

Environment = env_utils.getEnvironment('cube3')

useGPU = True

### Load nnet

from ml_utils import nnet_utils
from ml_utils import search_utils

if len(os.environ['CUDA_VISIBLE_DEVICES']) > 1:
    gpuNums = [int(x) for x in os.environ['CUDA_VISIBLE_DEVICES'].split(",")]
else:
    gpuNums = [None]
numParallel = len(gpuNums)

    ### Initialize files
dataQueues = []
resQueues = []
for num in range(numParallel):
    dataQueues.append(Queue(1))
    resQueues.append(Queue(1))

    dataListenerProc = Process(target=dataListener, args=(dataQueues[num],resQueues[num],gpuNums[num],))
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
    print(data["solution"])

if __name__ == '__main__':
    filename = '../data/cube3/states.pkl'
    inputData = pickle.load(open(filename,"rb"), encoding='iso-8859-1')
    states = inputData['states']
    for state in states:
        solveState(state)