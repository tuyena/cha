from flask import Flask, render_template
from flask_socketio import SocketIO, send
from googletrans import Translator
import sys

# Thiết lập mã hóa UTF-8 cho việc in ra
sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    # Nhận tin nhắn và người gửi từ client
    original_msg = data['message']
    sender = data['sender']

    # In tin nhắn ra console với mã hóa UTF-8
    print('Received message: ' + original_msg)

    # Phát hiện ngôn ngữ và dịch nếu cần
    translated_msg = ''
    try:
        detected_lang = translator.detect(original_msg).lang
        if detected_lang == 'vi':  # Nếu tin nhắn bằng tiếng Việt
            translated_msg = translator.translate(original_msg, dest='my').text  # Dịch sang tiếng Myanmar
        elif detected_lang == 'my':  # Nếu tin nhắn bằng tiếng Myanmar
            translated_msg = translator.translate(original_msg, dest='vi').text  # Dịch sang tiếng Việt
    except Exception as e:
        print(f"Lỗi dịch: {e}")
        translated_msg = ''  # Nếu có lỗi, không dịch

    # Gửi tin nhắn gốc và tin nhắn đã dịch (nếu có) cho tất cả người dùng trong một lần
    send({
        'sender': sender,
        'message': original_msg,
        'translatedMessage': translated_msg
    }, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
