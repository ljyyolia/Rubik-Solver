from flask import request
from .DeepCubeA.code.scripts.solveState import solve_state

flask_app = Flask(__name__)

def get_data(request,name):
    if request.method == 'POST':
        value=request.form[name]
    elif request.method == 'GET':
        value=request.args.get(name)
    else:
        return False,None

    return True,value

@flask_app.route('/')
def index():
    p=psutil.Process()
    return render_template('index.html',
                            title='index',
                            pid=p.pid,
                            status=p.status(),
                            is_running=p.is_running())

@flask_app.route('/solve', methods=['POST', 'GET'])
def start_task():
    flag, state=get_data(request, 'state')
    if not flag:
        return 'getting cube state failed'
    ret, data = solve_state(state)
    return ret, data

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('-p','--port',help='port for web application',default=5005,type=int)
    args=parser.parse_args()
    flask_app.run(debug=True, host='0.0.0.0', port=args.port)
