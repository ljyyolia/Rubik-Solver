from django.http import HttpResponse
import requests,json
import numpy as np
def solve(request):
    #print(request.POST["query"])
    print('solved')
    context = {}
    context['answer'] = '1233'
    testState = np.array(request.POST["query"])
    #print(ret)
    #print(data)
    return HttpResponse(json.dumps(context),content_type='application/json')