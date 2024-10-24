from collections import OrderedDict
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework import status


class RestPagination(PageNumberPagination, LimitOffsetPagination):
    """
    Pagination class that adds pagination metadata into a 'meta' field.
    """

    def paginate_queryset(self, queryset, request, view=None):
        queryset = super().paginate_queryset(queryset, request, view=view)
        limit = request.query_params.get('limit')
        if str(limit).isdigit():
            return queryset[:int(limit)]
        return queryset

    def get_paginated_response(self, results):
        next_link = self.get_next_link() or None
        prev_link = self.get_previous_link() or None

        if settings.USE_SSL:
            next_link = next_link.replace('http:', 'https:') if next_link else None
            prev_link = prev_link.replace('http:', 'https:') if prev_link else None

        return Response(OrderedDict([
            ('meta', OrderedDict([
                ('count', self.page.paginator.count),
                ('page_size', self.page_size),
                ('current_page', self.page.number),
                ('next', next_link),
                ('previous', prev_link),
            ])),
            ('status', status.HTTP_200_OK),
            ('message', _('Success')),
            ('success', True),
            ('results', results),
        ]))
