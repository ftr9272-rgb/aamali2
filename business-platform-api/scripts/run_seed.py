from src.seed_merchant_data import create_merchant_sample_data
from src.main import app

if __name__ == '__main__':
    with app.app_context():
        create_merchant_sample_data()
        print('SEED_DONE')
