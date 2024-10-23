import json
import copy
from django.utils.deprecation import MiddlewareMixin
from django.utils.translation import gettext_lazy as _
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import status


class BaseAPIResponseMiddleware(MiddlewareMixin):

    def render_response(self, response):
        """
        Adjusted response API with 'meta' for pagination data.
        """
        default_response_keys = ('status', 'status_http', 'detail', 'message', 
                                 'success', 'non_field_errors', 'meta', 'result', 'results')

        response_data = copy.deepcopy(response.data)

        # Initialize result
        if not any(['result' in response_data, 'results' in response_data]):
            response_data.update({'result': {}})

        # Ensure 'message' exists
        if 'message' not in response_data:
            response_data.update({'message': None})

        # Update 'status' and 'status_http'
        response_data.setdefault('status', response.status_code)
        response_data.setdefault('status_http', response.status_code)

        # Handle 'detail' and non-field errors
        if 'detail' in response_data:
            response_data['message'] = response_data.get('detail')
            del response_data['detail']

        # Check for specific field errors
        field_errors = {k: v for k, v in response_data.items() if k not in default_response_keys and isinstance(v, list) and v}
        
        if field_errors:
            errors_message = '<br />'.join([f"{key}: {' '.join(value)}" for key, value in field_errors.items()])
            response_data['message'] = errors_message
            response_data['success'] = False
            response_data['status_http'] = status.HTTP_400_BAD_REQUEST

        # Final success message adjustments
        if response.status_code >= 200 and response.status_code < 400:
            response_data['success'] = True
            if not response_data.get('message'):
                response_data['message'] = _('Success')

        # Handle pagination meta data
        if 'count' in response_data or 'page_size' in response_data:
            meta_data = {
                'count': response_data.pop('count', None),
                'page_size': response_data.pop('page_size', None),
                'current_page': response_data.pop('current_page', None),
                'next': response_data.pop('next', None),
                'previous': response_data.pop('previous', None),
            }
            response_data.update({'meta': meta_data})

        return response_data

    def process_response(self, request, response):
        if hasattr(response, 'data') and isinstance(response.data, dict):
            try:
                response_data = self.render_response(response)
                response.status_code = response_data.get('status_http')
                if 'status_http' in response_data:
                    del response_data['status_http']
                response.data = response_data
                response.content = json.dumps(response_data, cls=DjangoJSONEncoder)
            except Exception:
                pass
        return response

