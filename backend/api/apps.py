from django.apps import AppConfig
import requests, os


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        self.download_csv_file()

    def download_csv_file(self):
        csv_url = "https://open.canada.ca/data/dataset/d8f85d91-7dec-4fd1-8055-483b77225d8b/resource/fac950c0-00d5-4ec1-a4d3-9cbebf98a305/download/contracts.csv"
        file_path = os.path.join(os.path.dirname(__file__), 'data', 'contracts.csv')

        if not os.path.exists(file_path):
            print('Downloading CSV file...')
            response = requests.get(csv_url)
            if response.status_code == 200:
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                print('CSV file downloaded successfully.')
            else:
                print('Failed to download CSV file.')
        
