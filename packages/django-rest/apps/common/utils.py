from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException

class CustomResponse(Response):
    def __init__(self, data=None, status=None, template_name=None, headers=None, exception=False, content_type=None):
        super().__init__(data, status, template_name, headers, exception, content_type)
        self.data = {
            'success': True,
            'message': 'Success',
            'data': data
        }

class CustomAPIException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'An error occurred'
    default_code = 'error'

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = detail
        if code is not None:
            self.code = code

    def __str__(self):
        return self.detail
