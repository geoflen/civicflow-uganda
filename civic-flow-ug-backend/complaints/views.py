from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import Complaint, ComplaintCategory, ComplaintStatus
from .serializers import (
	ComplaintCategorySerializer,
	ComplaintSerializer,
	ComplaintStatusSerializer,
	PublicComplaintCreateSerializer,
)
from .serializers import PublicComplaintSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


class ComplaintViewSet(viewsets.ModelViewSet):
	queryset = Complaint.objects.select_related(
		"category", "status", "priority", "created_by", "assigned_to", "district"
	).prefetch_related("attachments").all()
	serializer_class = ComplaintSerializer
	permission_classes = [permissions.IsAuthenticated]
	parser_classes = [JSONParser, FormParser, MultiPartParser]
	filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
	filterset_fields = ["status", "category", "assigned_to", "created_by"]
	search_fields = ["title", "description", "ticket_number"]
	ordering_fields = ["created_at", "updated_at"]

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)

	@action(
		detail=False,
		methods=["post"],
		permission_classes=[permissions.AllowAny],
		parser_classes=[MultiPartParser, FormParser, JSONParser],
		url_path="public",
	)
	def public(self, request):
		serializer = PublicComplaintCreateSerializer(data=request.data, context={"request": request})
		serializer.is_valid(raise_exception=True)
		complaint = serializer.save()
		return Response(
			PublicComplaintSerializer(complaint, context={"request": request}).data,
			status=status.HTTP_201_CREATED,
		)


class ComplaintCategoryViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = ComplaintCategory.objects.filter()
	serializer_class = ComplaintCategorySerializer
	permission_classes = [permissions.IsAuthenticated]


class ComplaintStatusViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = ComplaintStatus.objects.filter()
	serializer_class = ComplaintStatusSerializer
	permission_classes = [permissions.IsAuthenticated]



class TicketTrackAPIView(APIView):
	"""Public endpoint to track a complaint by its ticket number."""
	permission_classes = [AllowAny]

	def get(self, request, ticket_number):
		complaint = get_object_or_404(Complaint, ticket_number=ticket_number)
		serializer = PublicComplaintSerializer(complaint, context={"request": request})
		return Response(serializer.data, status=status.HTTP_200_OK)
