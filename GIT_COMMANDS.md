# أوامر Git المهمة لمشروع TinyMCE

## 🚀 الأوامر الأساسية

### 1. رفع التغييرات إلى GitHub
```bash
# إضافة جميع الملفات
git add .

# أو إضافة ملفات محددة
git add filename.txt

# عمل commit مع رسالة
git commit -m "وصف التغييرات"

# رفع التغييرات إلى GitHub
git push origin main
```

### 2. استلام التحديثات من GitHub
```bash
# استلام آخر التحديثات
git pull origin main

# أو استلام وتحديث الفرع الحالي
git fetch origin
git merge origin/main
```

### 3. استلام نسخة محددة (commit معين)
```bash
# عرض تاريخ الـ commits
git log --oneline

# استلام نسخة محددة
git checkout <commit-hash>

# العودة للنسخة الأحدث
git checkout main
```

### 4. استرداد النسخة من GitHub بالضبط (مسح التغييرات المحلية)
```bash
# مسح جميع التغييرات غير المحفوظة
git reset --hard HEAD

# استرداد النسخة من GitHub بالضبط
git fetch origin
git reset --hard origin/main

# مسح الملفات غير المتتبعة
git clean -fd
```

### 5. إنشاء نسخة احتياطية
```bash
# إنشاء فرع جديد للنسخة الاحتياطية
git checkout -b backup-$(date +%Y%m%d)

# العودة للفرع الرئيسي
git checkout main
```

### 6. عرض حالة المشروع
```bash
# عرض حالة الملفات
git status

# عرض التغييرات
git diff

# عرض تاريخ الـ commits
git log --oneline --graph
```

## 🔄 سيناريوهات شائعة

### السيناريو 1: رفع تغييرات جديدة
```bash
git add .
git commit -m "إضافة ميزة جديدة"
git push origin main
```

### السيناريو 2: استلام آخر التحديثات
```bash
git pull origin main
```

### السيناريو 3: استرداد النسخة من GitHub بالضبط
```bash
git fetch origin
git reset --hard origin/main
git clean -fd
```

### السيناريو 4: العمل على نسخة قديمة مؤقتاً
```bash
git log --oneline
git checkout <commit-hash>
# عمل التغييرات المطلوبة
git checkout main
```

### السيناريو 5: إنشاء نسخة احتياطية قبل التغييرات الكبيرة
```bash
git checkout -b backup-before-changes
git add .
git commit -m "نسخة احتياطية قبل التغييرات"
git checkout main
```

## ⚠️ تحذيرات مهمة

1. **قبل `git reset --hard`**: تأكد من حفظ عملك لأن هذا الأمر سيمسح جميع التغييرات غير المحفوظة
2. **قبل `git clean -fd`**: هذا الأمر سيمسح جميع الملفات غير المتتبعة
3. **قبل `git push`**: تأكد من عمل `git pull` أولاً لتجنب التعارضات

## 🆘 حل المشاكل الشائعة

### مشكلة: "Your branch is ahead of origin/main"
```bash
git push origin main
```

### مشكلة: "Your branch is behind origin/main"
```bash
git pull origin main
```

### مشكلة: تعارض في الدمج (Merge conflict)
```bash
# حل التعارضات يدوياً في الملفات
git add .
git commit -m "حل التعارضات"
git push origin main
```

### مشكلة: رفض الرفع (Push rejected)
```bash
git pull origin main
git push origin main
```

## 📝 نصائح مفيدة

1. **اعمل commit صغير ومتكرر** بدلاً من commit كبير
2. **اكتب رسائل commit واضحة** تصف التغييرات
3. **اعمل pull قبل push** دائماً
4. **احتفظ بنسخ احتياطية** قبل التغييرات الكبيرة
5. **استخدم branches** للعمل على ميزات جديدة

## 🔗 روابط مفيدة

- [GitHub Repository](https://github.com/seopludade/projecttinymce)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://help.github.com/)

---
**ملاحظة**: استبدل `main` بـ `master` إذا كان الفرع الرئيسي في مشروعك يسمى `master`
