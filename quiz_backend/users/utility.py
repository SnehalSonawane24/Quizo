from rest_framework.response import Response


def custom_response(message="", success=True, data=None, error_code="", error_message="", error_fields=None, status_code=200):
    return Response({
        "Success": success,
        "Message": message,
        "Error":{
            "code": error_code,
            "message": error_message,
            "fields": error_fields or []
        },
        "Data": data
    }, status=status_code)