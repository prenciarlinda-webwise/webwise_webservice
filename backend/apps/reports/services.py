"""Supabase storage service for report files."""

from django.conf import settings
from supabase import create_client, Client
import uuid
from datetime import datetime


class SupabaseStorageService:
    """Service for managing files in Supabase Storage."""

    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
        self.bucket = settings.SUPABASE_BUCKET

    def generate_file_path(self, client_id: int, filename: str) -> str:
        """Generate a unique file path for storage."""
        ext = filename.split('.')[-1] if '.' in filename else ''
        unique_id = uuid.uuid4().hex[:8]
        timestamp = datetime.now().strftime('%Y%m%d')
        safe_filename = f"{timestamp}_{unique_id}.{ext}" if ext else f"{timestamp}_{unique_id}"
        return f"client_{client_id}/{safe_filename}"

    def get_upload_url(self, file_path: str, expires_in: int = 3600) -> dict:
        """
        Generate a signed URL for uploading a file.

        Args:
            file_path: The path where the file will be stored
            expires_in: URL expiration time in seconds (default 1 hour)

        Returns:
            dict with 'signed_url' and 'path'
        """
        try:
            result = self.client.storage.from_(self.bucket).create_signed_upload_url(
                file_path
            )
            return {
                'signed_url': result.get('signedURL') or result.get('signed_url'),
                'path': file_path,
                'token': result.get('token', '')
            }
        except Exception as e:
            raise Exception(f"Failed to generate upload URL: {str(e)}")

    def get_download_url(self, file_path: str, expires_in: int = 3600) -> str:
        """
        Generate a signed URL for downloading a file.

        Args:
            file_path: The path of the file in storage
            expires_in: URL expiration time in seconds (default 1 hour)

        Returns:
            Signed download URL
        """
        try:
            result = self.client.storage.from_(self.bucket).create_signed_url(
                file_path,
                expires_in
            )
            return result.get('signedURL') or result.get('signed_url', '')
        except Exception as e:
            raise Exception(f"Failed to generate download URL: {str(e)}")

    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from storage.

        Args:
            file_path: The path of the file to delete

        Returns:
            True if successful
        """
        try:
            self.client.storage.from_(self.bucket).remove([file_path])
            return True
        except Exception as e:
            raise Exception(f"Failed to delete file: {str(e)}")

    def get_public_url(self, file_path: str) -> str:
        """
        Get the public URL for a file (if bucket is public).

        Args:
            file_path: The path of the file

        Returns:
            Public URL
        """
        return self.client.storage.from_(self.bucket).get_public_url(file_path)


# Singleton instance
storage_service = SupabaseStorageService() if settings.SUPABASE_URL else None
