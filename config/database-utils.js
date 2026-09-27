/**
 * ===============================================
 * أدوات وعمليات مساعدة لقاعدة البيانات
 * ===============================================
 * منصة مدرسة الشعب التعليمية
 * إعداد: أ/ أنيس المقطري
 * ===============================================
 */

class DatabaseUtils {
  /**
   * البيانات الأساسية للمنصة
   */
  static platformData = {
    name: "منصة مدرسة الشعب التعليمية",
    manager: {
      name: "محمد هزاع عبدالله",
      role: "مدير",
      permissions: "Full Admin Access"
    },
    developer: {
      name: "أنيس المقطري",
      role: "أعداد وتطوير",
      specialization: "Database & Backend"
    }
  };

  /**
   * التحقق من صحة بيانات المستخدم
   * @param {Object} userData - بيانات المستخدم
   * @returns {Object} - نتيجة التحقق
   */
  static validateUserData(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim() === '') {
      errors.push('الاسم مطلوب');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }

    if (!userData.userType || !['student', 'teacher', 'admin'].includes(userData.userType)) {
      errors.push('نوع المستخدم غير صحيح');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * توليد معرف فريد
   * @param {string} prefix - البادئة
   * @returns {string}
   */
  static generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * تنسيق التاريخ بصيغة عربية
   * @param {Date} date - التاريخ
   * @returns {string}
   */
  static formatDateInArabic(date) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ar-EG', options);
  }

  /**
   * تحويل البيانات إلى صيغة JSON آمنة
   * @param {Object} data - البيانات
   * @returns {string}
   */
  static safeJsonStringify(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * التحقق من الصلاحيات
   * @param {string} userRole - دور المستخدم
   * @param {string} requiredPermission - الصلاحية المطلوبة
   * @returns {boolean}
   */
  static hasPermission(userRole, requiredPermission) {
    const permissions = {
      'admin': [
        'manage_users',
        'manage_courses',
        'manage_teachers',
        'manage_students',
        'view_reports',
        'manage_database',
        'system_settings',
        'full_access'
      ],
      'teacher': [
        'manage_courses',
        'create_assignments',
        'grade_submissions',
        'view_class_reports',
        'manage_students'
      ],
      'student': [
        'view_courses',
        'submit_assignments',
        'view_grades',
        'download_materials'
      ]
    };

    const userPermissions = permissions[userRole] || [];
    return userPermissions.includes(requiredPermission);
  }

  /**
   * إنشاء نموذج مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   * @returns {Object}
   */
  static createUserModel(userData) {
    const validation = this.validateUserData(userData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    return {
      success: true,
      user: {
        id: this.generateId('user'),
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        grade: userData.grade || null,
        joinDate: new Date().toISOString(),
        status: 'active',
        createdAt: this.formatDateInArabic(new Date()),
        ...userData
      }
    };
  }

  /**
   * إنشاء نموذج مادة دراسية
   * @param {Object} courseData - بيانات المادة
   * @returns {Object}
   */
  static createCourseModel(courseData) {
    return {
      id: this.generateId('course'),
      name: courseData.name,
      arabicName: courseData.arabicName,
      grade: courseData.grade,
      teacher: courseData.teacher,
      description: courseData.description || '',
      units: courseData.units || [],
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      status: 'active',
      createdAtArabic: this.formatDateInArabic(new Date())
    };
  }

  /**
   * إنشاء نموذج درس جديد
   * @param {Object} lessonData - بيانات الدرس
   * @returns {Object}
   */
  static createLessonModel(lessonData) {
    return {
      id: this.generateId('lesson'),
      courseId: lessonData.courseId,
      title: lessonData.title,
      description: lessonData.description || '',
      content: lessonData.content || '',
      objectives: lessonData.objectives || [],
      resources: lessonData.resources || [],
      duration: lessonData.duration || 45, // بالدقائق
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: lessonData.createdBy,
      status: 'active'
    };
  }

  /**
   * إنشاء نموذج واجب دراسي
   * @param {Object} assignmentData - بيانات الواجب
   * @returns {Object}
   */
  static createAssignmentModel(assignmentData) {
    return {
      id: this.generateId('assignment'),
      courseId: assignmentData.courseId,
      title: assignmentData.title,
      description: assignmentData.description || '',
      instructions: assignmentData.instructions || '',
      dueDate: assignmentData.dueDate,
      totalPoints: assignmentData.totalPoints || 100,
      attachments: assignmentData.attachments || [],
      createdBy: assignmentData.createdBy,
      createdDate: new Date().toISOString(),
      status: 'active'
    };
  }

  /**
   * حساب النسبة المئوية
   * @param {number} score - الدرجة
   * @param {number} maxScore - الدرجة الكاملة
   * @returns {number}
   */
  static calculatePercentage(score, maxScore) {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  }

  /**
   * تقييم الأداء بناءً على النسبة المئوية
   * @param {number} percentage - النسبة المئوية
   * @returns {string}
   */
  static getGradeLevel(percentage) {
    if (percentage >= 90) return 'ممتاز';
    if (percentage >= 80) return 'جيد جداً';
    if (percentage >= 70) return 'جيد';
    if (percentage >= 60) return 'مقبول';
    return 'يحتاج إلى تحسين';
  }

  /**
   * إنشاء تقرير إحصائي
   * @param {Array} data - البيانات
   * @returns {Object}
   */
  static generateStatisticsReport(data) {
    const total = data.length;
    const average = data.length > 0 ? 
      data.reduce((a, b) => a + b, 0) / total : 0;
    const max = Math.max(...data);
    const min = Math.min(...data);

    return {
      total,
      average: Math.round(average * 100) / 100,
      maximum: max,
      minimum: min,
      median: this.calculateMedian(data),
      standardDeviation: this.calculateStandardDeviation(data)
    };
  }

  /**
   * حساب الوسيط
   * @param {Array} data - البيانات
   * @returns {number}
   */
  static calculateMedian(data) {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : 
      (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * حساب الانحراف المعياري
   * @param {Array} data - البيانات
   * @returns {number}
   */
  static calculateStandardDeviation(data) {
    if (data.length === 0) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  /**
   * تسجيل العملية (Logging)
   * @param {string} level - مستوى التسجيل
   * @param {string} message - الرسالة
   * @param {Object} data - البيانات الإضافية
   */
  static log(level, message, data = {}) {
    const timestamp = this.formatDateInArabic(new Date());
    console.log(`[${timestamp}] [${level}] ${message}`, data);
  }

  /**
   * تصدير البيانات إلى CSV
   * @param {Array} data - البيانات
   * @param {string} filename - اسم الملف
   */
  static exportToCSV(data, filename = 'export.csv') {
    if (data.length === 0) {
      console.warn('لا توجد بيانات للتصدير');
      return;
    }

    const keys = Object.keys(data[0]);
    const csv = [
      keys.join(','),
      ...data.map(item => 
        keys.map(key => {
          const value = item[key];
          const escaped = typeof value === 'string' ? 
            `"${value.replace(/"/g, '""')}"` : value;
          return escaped;
        }).join(',')
      )
    ].join('\n');

    return csv;
  }
}

// تصدير الفئة
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseUtils;
}
