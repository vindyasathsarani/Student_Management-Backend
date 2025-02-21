const express = require('express');
const router = express.Router();
const { adminAuth, studentAuth } = require('../middlewares/auth');
const enrollmentController = require('../controllers/enrollmentController');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student course enrollment management
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Enrollment successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 * 
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all enrollments
 * 
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment data
 *       404:
 *         description: Enrollment not found
 * 
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 * 
 *   put:
 *     summary: Update enrollment status
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *             example:
 *               status: "completed"
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 */
router.post('/', adminAuth, enrollmentController.enrollStudent);
router.delete('/:id', adminAuth, enrollmentController.deleteEnrollment);
router.get('/my-enrollments', studentAuth, enrollmentController.getStudentEnrollments);
router.get('/:id', adminAuth, enrollmentController.getEnrollment);
router.put('/:id', adminAuth, enrollmentController.updateEnrollment);

module.exports = router; 