import pika
import json
import time
import os
import logging
from dotenv import load_dotenv

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('ML_Worker')

load_dotenv()

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672/')
QUEUE_NAME = 'audio_processing_queue'

def process_audio(ch, method, properties, body):
    try:
        # Парсим входящее сообщение от NestJS
        data = json.loads(body)
        track_id = data.get('trackId')
        s3_url = data.get('s3Url')
        user_id = data.get('userId')
        
        logger.info(f"[x] Received task for Track ID: {track_id}")
        logger.info(f"[x] Downloading audio from S3: {s3_url}")
        
        # Здесь будет реальный ML инференс (например, librosa + PyTorch/TensorFlow)
        # Пока мы эмулируем тяжелую работу процессора
        logger.info("[x] Running ML Audio-to-MIDI inference...")
        time.sleep(5) 
        
        logger.info("[x] ML inference completed. Generating MIDI and MusicXML...")
        time.sleep(2)
        
        # В реальности здесь мы бы загрузили сгенерированные файлы обратно в S3
        mock_midi_url = f"https://piano-audio-bucket.s3.amazonaws.com/{user_id}/{track_id}.mid"
        
        # Оповещаем бэкенд об успехе (в будущем добавим публикацию в очередь результатов)
        logger.info(f"[v] Successfully processed Track ID: {track_id}")
        
        # Подтверждаем RabbitMQ, что задача выполнена (удаляем из очереди)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        logger.error(f"[!] Error processing task: {e}")
        # Если ошибка, возвращаем задачу в очередь
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def main():
    logger.info("Connecting to RabbitMQ...")
    parameters = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # Убеждаемся, что очередь существует (durable=True, как в NestJS)
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # Не брать больше одной задачи одновременно
    channel.basic_qos(prefetch_count=1)
    
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_audio)

    logger.info(f"[*] Waiting for messages in '{QUEUE_NAME}'. To exit press CTRL+C")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        logger.info("Stopping worker...")
        channel.stop_consuming()
    finally:
        connection.close()

if __name__ == '__main__':
    main()