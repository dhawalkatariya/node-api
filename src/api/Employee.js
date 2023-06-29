/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - fullName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         fullName:
 *           type: string
 *           description: Full Name of the Employee
 *         jobTitle:
 *           type: string
 *           description: Employee's Job Title
 *         primaryContactName:
 *           type: string
 *           description: Employee's primary contact's Name
 *         primaryContactPhone:
 *           type: string
 *           description: Employee's primary contact's phone number
 *         primaryContactRelation:
 *           type: string
 *           description: Employee's primary contact's relation
 *         secondaryContactName:
 *           type: string
 *           description: Employee's secondary contact's Name
 *         secondaryContactPhone:
 *           type: string
 *           description: Employee's secondary contact's phone number
 *         secondaryContactRelation:
 *           type: string
 *           description: Employee's secondary contact's relation
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the Employee was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the Employee was updated
 *       example:
 *        fullName: Dhaval Katriya,
 *        jobTitle: Unemployed,
 *        primaryContactName: Karan S Solanki,
 *        primaryContactPhone: 201901085,
 *        primaryContactRelation: friend,
 *        secondaryContactName: Yash Prajapati,
 *        secondaryContactPhone: 201901120,
 *        secondaryContactRelation: friend,
 *     EmployeeWithContact:
 *      allOf:
 *        - $ref: "#/components/schemas/Employee"
 *        - type: object
 *          properties:
 *              contact:
 *                  type: object
 *                  properties:
 *                      email:
 *                      type: string
 *                  phone:
 *                      type: string
 */

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee API
 * /employee:
 *   post:
 *     summary: Create a new Employee
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeWithContact'
 *     responses:
 *       200:
 *         description: The Employee was created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeWithContact'
 * /employee/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     responses:
 *       200:
 *         description: The Employee was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                  message: Employee Updated successfully!
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Get Employee by id
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     responses:
 *       200:
 *         description: The Employee was created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeWithContact'
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     responses:
 *       200:
 *         description: The Employee was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                  message: Employee Deleted successfully!
 *       500:
 *         description: Internal Server Error
 */

const Employee = require("../db/model/Employee")
const Contact = require('../db/model/Contact')
const { Router } = require("express");
const { where } = require("sequelize");

const router = Router()


router.post("/", async (req, res) => {
    const { id } = req.params;
    try {
        const { contacts, ...employee } = req.body;
        const employeeObj = await Employee.create(employee);
        if (contacts?.length) {
            const contactsObj = await Contact.bulkCreate(contacts);
            await employeeObj.addContacts(contactsObj);
        }
        return res.json(employeeObj.toJSON())
    } catch (e) {
        console.log('POST /employee/:id error: ', e.message);
        res.sendStatus(500);
    }
});

// get an employee
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const employeeObj = await Employee.findByPk(id, { include: [Contact] });
        return res.json(employeeObj.toJSON())
    } catch (e) {
        console.log('GET /employee/:id error: ', e.message);
        res.sendStatus(500);
    }
});

// update employee
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Employee.update(req.body, { where: { id: id } })
        res.json({ message: "Employee Updated successfully!" });
    } catch (e) {
        console.log('PUT /employee/:id error: ', e.message);
        res.sendStatus(500);
    }
});

// delete employee
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Employee.destroy({ where: { id: id } });
        res.json({ message: "Employee deleted successfully!" });
    } catch (e) {
        console.log('DELETE /employee/:id error: ', e.message);
        res.sendStatus(500);
    }
})

// get list of employee
router.get("/", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const list = await Employee.findAll({
            limit: 20,
            offset: (page - 1) * 20
        });
        const resObj = {
            nextPage: page + 1,
            isFinal: list.length !== 20,
            employees: list?.map(e => e.toJSON())
        };
        res.json(resObj);
    } catch (e) {
        console.log('GET /employee error: ', e.message);
        res.sendStatus(500);
    }
})

module.exports = router;