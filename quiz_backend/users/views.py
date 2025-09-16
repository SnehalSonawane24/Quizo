from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from users.models import CustomUser
from users.utility import custom_response
from users.serializers import LoginSerializer, RegisterSerializer


class RegisterApiView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return custom_response(
                success=True,
                message="User Registered Successfully",
                data={"id": user.id, "username": user.username, "email": user.email, "role": user.role},
                status_code=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginApiView(APIView):

    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            return custom_response(
                success=True,
                message="Login Successfully",
                data={
                    "refresh": data.get("refresh"),
                    "access": data.get("access"),
                    "user": data["user"]["id"]
                },
                status_code=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)