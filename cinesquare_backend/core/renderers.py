from rest_framework.renderers import JSONRenderer


class StandardJSONResponseRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = renderer_context['response'].status_code
        if 200 <= status_code <= 299:
            response = {'success': True, **data} if data else {'success': True}
        else:
            response = {**data, 'success': False} if data else {'success': False}
        return super(StandardJSONResponseRenderer, self).render(response, accepted_media_type, renderer_context)
