const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const items = [
    { name: "Марат Иванович", specialization: "Варка", schedule: "Понедельник, пятница", favourite: "Охотничья" },
    { name: "Кирилл Никитич", specialization: "Охота", schedule: "Среда, четверг", favourite: "Варёная" }
];

app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = multer({ storage });

app.get('/api/employees', (req, res) => {
    try {
        console.log('Запрос на получение данных...');
        res.status(200).json({ message: 'Данные успешно получены.', items });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении данных.' });
    }
});

app.post('/api/items', upload.single('image'), (req, res) => {
    try {
        const { name, price } = req.body; 
        const file = req.file;

        if (!name || !price || !file) {
            return res.status(400).json({ message: 'Все поля обязательны.' });
        }

        console.log('Получено новое добавление:');
        console.log('Название:', name);
        console.log('Цена:', price);
        console.log('Файл:', file.filename);

        res.status(200).json({
            message: 'Элемент успешно добавлен.',
            data: { name, price, imagePath: `/uploads/${file.filename}` },
        });
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
