const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// تخزين مؤقت للمهام (في التطبيق الحقيقي استخدم قاعدة بيانات)
let todos = [];
let currentId = 1;

// Routes

// GET /todos - جلب جميع المهام
app.get('/todos', (req, res) => {
    res.json({
        success: true,
        data: todos,
        count: todos.length
    });
});

// GET /todos/:id - جلب مهمة محددة
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'المهمة غير موجودة'
        });
    }
    
    res.json({
        success: true,
        data: todo
    });
});

// POST /todos - إنشاء مهمة جديدة
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'العنوان مطلوب'
        });
    }
    
    const newTodo = {
        id: currentId++,
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
        success: true,
        message: 'تم إنشاء المهمة بنجاح',
        data: newTodo
    });
});

// PUT /todos/:id - تحديث مهمة
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'المهمة غير موجودة'
        });
    }
    
    // تحديث البيانات
    if (title !== undefined) todos[todoIndex].title = title;
    if (description !== undefined) todos[todoIndex].description = description;
    if (completed !== undefined) todos[todoIndex].completed = completed;
    
    todos[todoIndex].updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        message: 'تم تحديث المهمة بنجاح',
        data: todos[todoIndex]
    });
});

// DELETE /todos/:id - حذف مهمة
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'المهمة غير موجودة'
        });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'تم حذف المهمة بنجاح',
        data: deletedTodo
    });
});

// DELETE /todos - حذف جميع المهام
app.delete('/todos', (req, res) => {
    const deletedCount = todos.length;
    todos = [];
    currentId = 1;
    
    res.json({
        success: true,
        message: `تم حذف ${deletedCount} مهمة`,
        deletedCount
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});

// صفحة الترحيب
app.get('/', (req, res) => {
    res.json({
        message: 'مرحباً في Todo List API',
        endpoints: {
            'GET /todos': 'جلب جميع المهام',
            'GET /todos/:id': 'جلب مهمة محددة',
            'POST /todos': 'إنشاء مهمة جديدة',
            'PUT /todos/:id': 'تحديث مهمة',
            'DELETE /todos/:id': 'حذف مهمة',
            'DELETE /todos': 'حذف جميع المهام'
        }
    });
});