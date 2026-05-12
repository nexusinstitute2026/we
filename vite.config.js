import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/we/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        al: resolve(__dirname, 'al.html'),
        prachina: resolve(__dirname, 'prachina.html'),
        register: resolve(__dirname, 'register.html'),
        studentDash: resolve(__dirname, 'dashboard/student.html'),
        teacherDash: resolve(__dirname, 'dashboard/teacher.html'),
        adminDash: resolve(__dirname, 'dashboard/admin.html'),
        course: resolve(__dirname, 'pages/course.html'),
        quiz: resolve(__dirname, 'pages/quiz.html'),
        quizResults: resolve(__dirname, 'pages/quiz-results.html'),
        payment: resolve(__dirname, 'pages/payment.html'),
        adminUsers: resolve(__dirname, 'admin/users.html'),
        adminCourses: resolve(__dirname, 'admin/courses.html'),
        adminPayments: resolve(__dirname, 'admin/payments.html'),
        teacherQuizBuilder: resolve(__dirname, 'teacher/quiz-builder.html'),
        teacherReports: resolve(__dirname, 'teacher/reports.html'),
      }
    }
  }
});
