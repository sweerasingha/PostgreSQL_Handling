const pool = require('../../db');
const queries = require('./queries');

const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getStudentById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const addStudent = (req, res) => {
    const { name, email, age, dob } = req.body;

    //check if email exists
    pool.query(queries.getStudentByEmail, [email], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length > 0) {
            return res.status(400).send('Email already exists')
        }

        // add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Student added successfully`)
        })
    })
}

const deleteStudent = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) {
            throw error
        }
        const noStudentFound = !results.rowCount;
        if (noStudentFound) {
            return res.status(404).send('Student not found')
        }
        pool.query(queries.deleteStudent, [id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Student deleted successfully`)
        })
    })
    
}

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id)
    const { name } = req.body;
    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) {
            throw error
        }
        const noStudentFound = !results.rowCount;
        if (noStudentFound) {
            return res.status(404).send('Student not found')
        }
        pool.query(queries.updateStudent, [name, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Student modified successfully`)
        })
    })
}

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    deleteStudent,
    updateStudent,
};