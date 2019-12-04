from flask import Flask, request, render_template
from DeepCubeA.code.scripts.solveState import solve_state
import argparse
import numpy as np
import json

flask_app = Flask(__name__)

@flask_app.route('/solve', methods=['POST'])
def start_task():
    #flag, state = get_data(request, 'state')
    data = request.json
    state = np.array(data['state'])
    print(state)
    ret, result_data = solve_state(state)
    
    if ret:
        result = dict()
        result["state"] = result_data["state"].tolist()
        result["time"] = result_data["time"]
        result["solution"] = result_data["solution"]
        return json.dumps(result)
    else:
        return 'failed'

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('-p','--port',help='port for web application',default=5005,type=int)
    args=parser.parse_args()
    flask_app.run(debug=True, host='0.0.0.0', port=args.port)
