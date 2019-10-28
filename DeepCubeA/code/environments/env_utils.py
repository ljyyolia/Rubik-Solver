import numpy as np
from random import choice
import re

import sys
sys.path.append('./')

def getEnvironment(envName):
    envName = envName.lower()
    if envName == 'cube3':
        from environments.cube_interactive_simple import Cube
        Environment = Cube(N=3,moveType="qtm")
    elif envName == 'cube3htm':
        from environments.cube_interactive_simple import Cube
        Environment = Cube(N=3,moveType="htm")
    elif envName == 'cube3htmaba':
        from environments.cube_interactive_simple import Cube
        Environment = Cube(N=3,moveType="htmaba")
        
    return(Environment)


def generate_envs(Environment,numPuzzles,scrambleRange,probs=None):
    assert(scrambleRange[0] > 0)
    scrambs = list(range(scrambleRange[0],scrambleRange[1]+1))
    legal = Environment.legalPlays
    puzzles = []
    puzzles_symm = []

    scrambleNums = np.zeros([numPuzzles],dtype=int)
    moves = []
    for puzzleNum in range(numPuzzles):
        startConfig_idx = np.random.randint(0,len(Environment.solvedState_all))

        scrambled = Environment.solvedState_all[startConfig_idx]
        scrambled_symm = np.stack(Environment.solvedState_all,axis=0)
        assert(Environment.checkSolved(scrambled))

        # Get scramble Num
        scrambleNum = np.random.choice(scrambs,p=probs)
        scrambleNums[puzzleNum] = scrambleNum
        # Scramble puzzle
        while Environment.checkSolved(scrambled): # don't return any solved puzzles
            moves_puzzle = []
            for i in range(scrambleNum):
                move = choice(legal)
                scrambled = Environment.next_state(scrambled, move)
                scrambled_symm = Environment.next_state(scrambled_symm, move)
                moves_puzzle.append(move)

        moves_puzzle.append(move)

        puzzles.append(scrambled)
        puzzles_symm.append(scrambled_symm)
    return(puzzles,scrambleNums,moves,puzzles_symm)


