/**
 * ملف إدارة التخزين المحلي
 * يحتوي على وظائف حفظ واسترجاع البيانات
 */

class StorageManager {
    constructor() {
        this.storageKey = 'tinyMCEDocuments';
        this.autoSaveKey = 'tinyMCAAutoSave';
        this.settingsKey = 'tinyMCESettings';
        this.maxAutoSaves = 10;
        this.autoSaveInterval = 30000; // 30 ثانية
        this.isAutoSaveEnabled = true;
        
        this.init();
    }

    /**
     * تهيئة مدير التخزين
     */
    init() {
        this.setupAutoSave();
        this.loadSettings();
        this.setupStorageListener();
    }

    /**
     * حفظ مستند جديد
     */
    saveDocument(documentData) {
        try {
            const documents = this.getAllDocuments();
            const document = {
                id: this.generateId(),
                title: documentData.title || 'مستند جديد',
                content: documentData.content || '',
                wordCount: documentData.wordCount || 0,
                characterCount: documentData.characterCount || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: documentData.tags || [],
                category: documentData.category || 'عام',
                isFavorite: documentData.isFavorite || false,
                version: 1
            };

            documents.push(document);
            localStorage.setItem(this.storageKey, JSON.stringify(documents));
            
            this.showNotification('تم حفظ المستند بنجاح', 'success');
            return document.id;
        } catch (error) {
            console.error('خطأ في حفظ المستند:', error);
            this.showNotification('حدث خطأ في حفظ المستند', 'error');
            return null;
        }
    }

    /**
     * تحديث مستند موجود
     */
    updateDocument(documentId, updateData) {
        try {
            const documents = this.getAllDocuments();
            const documentIndex = documents.findIndex(doc => doc.id === documentId);
            
            if (documentIndex === -1) {
                this.showNotification('المستند غير موجود', 'error');
                return false;
            }

            const document = documents[documentIndex];
            document.content = updateData.content || document.content;
            document.title = updateData.title || document.title;
            document.wordCount = updateData.wordCount || document.wordCount;
            document.characterCount = updateData.characterCount || document.characterCount;
            document.updatedAt = new Date().toISOString();
            document.tags = updateData.tags || document.tags;
            document.category = updateData.category || document.category;
            document.isFavorite = updateData.isFavorite !== undefined ? updateData.isFavorite : document.isFavorite;
            document.version = (document.version || 1) + 1;

            documents[documentIndex] = document;
            localStorage.setItem(this.storageKey, JSON.stringify(documents));
            
            this.showNotification('تم تحديث المستند بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في تحديث المستند:', error);
            this.showNotification('حدث خطأ في تحديث المستند', 'error');
            return false;
        }
    }

    /**
     * حذف مستند
     */
    deleteDocument(documentId) {
        try {
            const documents = this.getAllDocuments();
            const filteredDocuments = documents.filter(doc => doc.id !== documentId);
            
            if (filteredDocuments.length === documents.length) {
                this.showNotification('المستند غير موجود', 'error');
                return false;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(filteredDocuments));
            this.showNotification('تم حذف المستند بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في حذف المستند:', error);
            this.showNotification('حدث خطأ في حذف المستند', 'error');
            return false;
        }
    }

    /**
     * الحصول على جميع المستندات
     */
    getAllDocuments() {
        try {
            const documents = localStorage.getItem(this.storageKey);
            return documents ? JSON.parse(documents) : [];
        } catch (error) {
            console.error('خطأ في قراءة المستندات:', error);
            return [];
        }
    }

    /**
     * الحصول على مستند بالمعرف
     */
    getDocumentById(documentId) {
        const documents = this.getAllDocuments();
        return documents.find(doc => doc.id === documentId);
    }

    /**
     * البحث في المستندات
     */
    searchDocuments(query) {
        const documents = this.getAllDocuments();
        const searchTerm = query.toLowerCase();
        
        return documents.filter(doc => 
            doc.title.toLowerCase().includes(searchTerm) ||
            doc.content.toLowerCase().includes(searchTerm) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            doc.category.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * الحصول على المستندات المفضلة
     */
    getFavoriteDocuments() {
        const documents = this.getAllDocuments();
        return documents.filter(doc => doc.isFavorite);
    }

    /**
     * الحصول على المستندات حسب الفئة
     */
    getDocumentsByCategory(category) {
        const documents = this.getAllDocuments();
        return documents.filter(doc => doc.category === category);
    }

    /**
     * الحفظ التلقائي
     */
    autoSave(content) {
        if (!this.isAutoSaveEnabled) return;

        try {
            const autoSaveData = {
                content: content,
                timestamp: new Date().toISOString(),
                wordCount: this.countWords(content),
                characterCount: content.length
            };

            // حفظ النسخة الحالية
            localStorage.setItem(this.autoSaveKey, JSON.stringify(autoSaveData));

            // حفظ نسخ احتياطية (الحد الأقصى 10 نسخ)
            this.saveAutoSaveBackup(autoSaveData);
            
        } catch (error) {
            console.error('خطأ في الحفظ التلقائي:', error);
        }
    }

    /**
     * حفظ نسخة احتياطية للحفظ التلقائي
     */
    saveAutoSaveBackup(autoSaveData) {
        try {
            const backups = this.getAutoSaveBackups();
            backups.push(autoSaveData);

            // الاحتفاظ بالحد الأقصى من النسخ
            if (backups.length > this.maxAutoSaves) {
                backups.splice(0, backups.length - this.maxAutoSaves);
            }

            localStorage.setItem('tinyMCAAutoSaveBackups', JSON.stringify(backups));
        } catch (error) {
            console.error('خطأ في حفظ النسخة الاحتياطية:', error);
        }
    }

    /**
     * الحصول على النسخ الاحتياطية للحفظ التلقائي
     */
    getAutoSaveBackups() {
        try {
            const backups = localStorage.getItem('tinyMCAAutoSaveBackups');
            return backups ? JSON.parse(backups) : [];
        } catch (error) {
            console.error('خطأ في قراءة النسخ الاحتياطية:', error);
            return [];
        }
    }

    /**
     * استرجاع آخر حفظ تلقائي
     */
    getLastAutoSave() {
        try {
            const autoSave = localStorage.getItem(this.autoSaveKey);
            return autoSave ? JSON.parse(autoSave) : null;
        } catch (error) {
            console.error('خطأ في استرجاع آخر حفظ تلقائي:', error);
            return null;
        }
    }

    /**
     * استرجاع نسخة احتياطية محددة
     */
    restoreBackup(backupIndex) {
        try {
            const backups = this.getAutoSaveBackups();
            if (backupIndex >= 0 && backupIndex < backups.length) {
                return backups[backupIndex];
            }
            return null;
        } catch (error) {
            console.error('خطأ في استرجاع النسخة الاحتياطية:', error);
            return null;
        }
    }

    /**
     * تصدير المستندات
     */
    exportDocuments(format = 'json') {
        try {
            const documents = this.getAllDocuments();
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                documents: documents
            };

            if (format === 'json') {
                const dataStr = JSON.stringify(exportData, null, 2);
                this.downloadFile(dataStr, 'documents.json', 'application/json');
            } else if (format === 'csv') {
                const csvData = this.convertToCSV(documents);
                this.downloadFile(csvData, 'documents.csv', 'text/csv');
            }

            this.showNotification('تم تصدير المستندات بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في تصدير المستندات:', error);
            this.showNotification('حدث خطأ في تصدير المستندات', 'error');
        }
    }

    /**
     * استيراد المستندات
     */
    importDocuments(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    const existingDocuments = this.getAllDocuments();
                    const newDocuments = importData.documents || [];
                    
                    // دمج المستندات الجديدة مع الموجودة
                    const allDocuments = [...existingDocuments, ...newDocuments];
                    localStorage.setItem(this.storageKey, JSON.stringify(allDocuments));
                    
                    this.showNotification(`تم استيراد ${newDocuments.length} مستند بنجاح`, 'success');
                    resolve(newDocuments.length);
                } catch (error) {
                    console.error('خطأ في استيراد المستندات:', error);
                    this.showNotification('خطأ في تنسيق الملف المستورد', 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                this.showNotification('خطأ في قراءة الملف', 'error');
                reject(new Error('خطأ في قراءة الملف'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * حفظ الإعدادات
     */
    saveSettings(settings) {
        try {
            const currentSettings = this.loadSettings();
            const updatedSettings = { ...currentSettings, ...settings };
            localStorage.setItem(this.settingsKey, JSON.stringify(updatedSettings));
            return true;
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
            return false;
        }
    }

    /**
     * تحميل الإعدادات
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            const defaultSettings = {
                autoSave: true,
                autoSaveInterval: 30000,
                theme: 'default',
                fontSize: '14px',
                language: 'ar',
                showWordCount: true,
                showCharacterCount: true
            };
            
            return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
            return {
                autoSave: true,
                autoSaveInterval: 30000,
                theme: 'default',
                fontSize: '14px',
                language: 'ar',
                showWordCount: true,
                showCharacterCount: true
            };
        }
    }

    /**
     * مسح جميع البيانات
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.autoSaveKey);
            localStorage.removeItem('tinyMCAAutoSaveBackups');
            localStorage.removeItem(this.settingsKey);
            
            this.showNotification('تم مسح جميع البيانات', 'success');
            return true;
        } catch (error) {
            console.error('خطأ في مسح البيانات:', error);
            this.showNotification('حدث خطأ في مسح البيانات', 'error');
            return false;
        }
    }

    /**
     * إعداد الحفظ التلقائي
     */
    setupAutoSave() {
        if (this.isAutoSaveEnabled) {
            setInterval(() => {
                if (window.tinyMCEEditor && window.tinyMCEEditor.editor) {
                    const content = window.tinyMCEEditor.editor.getContent();
                    this.autoSave(content);
                }
            }, this.autoSaveInterval);
        }
    }

    /**
     * إعداد مستمع تغيير التخزين
     */
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                // إشعار التطبيق بتغيير البيانات
                window.dispatchEvent(new CustomEvent('documentsChanged'));
            }
        });
    }

    /**
     * تحويل المستندات إلى CSV
     */
    convertToCSV(documents) {
        const headers = ['العنوان', 'المحتوى', 'عدد الكلمات', 'تاريخ الإنشاء', 'الفئة', 'العلامات'];
        const rows = documents.map(doc => [
            doc.title,
            doc.content.replace(/\n/g, ' ').substring(0, 100) + '...',
            doc.wordCount,
            new Date(doc.createdAt).toLocaleDateString('ar-SA'),
            doc.category,
            doc.tags.join(', ')
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    /**
     * تحميل ملف
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * عد الكلمات
     */
    countWords(text) {
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        return cleanText.split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * توليد معرف فريد
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'success') {
        if (window.tinyMCEEditor) {
            window.tinyMCEEditor.showNotification(message, type);
        }
    }

    /**
     * الحصول على إحصائيات التخزين
     */
    getStorageStats() {
        try {
            const documents = this.getAllDocuments();
            const totalSize = JSON.stringify(documents).length;
            const totalWords = documents.reduce((sum, doc) => sum + (doc.wordCount || 0), 0);
            const totalCharacters = documents.reduce((sum, doc) => sum + (doc.characterCount || 0), 0);

            return {
                totalDocuments: documents.length,
                totalSize: totalSize,
                totalWords: totalWords,
                totalCharacters: totalCharacters,
                averageWordsPerDocument: documents.length > 0 ? Math.round(totalWords / documents.length) : 0,
                lastUpdated: documents.length > 0 ? Math.max(...documents.map(doc => new Date(doc.updatedAt).getTime())) : null
            };
        } catch (error) {
            console.error('خطأ في حساب الإحصائيات:', error);
            return null;
        }
    }
}

// إنشاء مثيل مدير التخزين
const storageManager = new StorageManager();

// تصدير للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
