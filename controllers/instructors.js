const fs = require('fs')
const data = require("../data.json") // importando json data
const { age, date } = require('../utils')

exports.index = function(req, res) {

 const instructors = data.instructors.map(function(instructor){
     const spreadInstructor = {
         ...instructor,
         services: instructor.services.split(',')
     }
     return spreadInstructor
 })

    return res.render('instructors/index',{instructors})
}

exports.create = function(req, res) {
    return res.render('instructors/create')
}

exports.post = function(req, res) {
    //req.body
    // retorna = { "avatar_url": "http://www.test.com.br", "name": "Gabriel", "birth": "2019-12-01", "gender": "M", "services": "rqr" }

    //Keys retorna = [ "avatar_url", "name", "birth", "gender", "services" ]
    const keys = Object.keys(req.body) // retorna um array com as chaves do objeto

    for (key of keys) {
        // A linha abaixo é a mesma coisa que req.body.avatar_url ou qualquer coisa chave.
        if (req.body[key] == "") {
            return res.send("Please, fill all fields")
        }
    }

    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(birth) // Trabalhando com data no js
    const created_At = Date.now() // Trabalhando com data no js
    let id = 1
<<<<<<< HEAD
    const lastMember = data.members[data.members.length - 1]

    if(lastMember) {
        id = lastMember.id + 1
=======
    const lastInstructor = data.instructors[data.instructors.length - 1]

    if(lastInstructor) {
        id = lastInstructor.id + 1
>>>>>>> 85670afca95e589511d76e317024f7606e18ac97
    }

    data.instructors.push({
            id,
            name,
            avatar_url,
            birth,
            gender,
            services,
            created_At
        }) // utilizando o arquivo json data - adicionando o req.body no array

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send('Write file error')
        }
        return res.redirect('/instructors')
    })

    // return res.send(req.body)
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instructor not found!')

    //conceito spread
    const instructor = {
        ...foundInstructor, // aplicando o spread
        age: age(foundInstructor.birth), // aplicando funcao age em birth
        services: foundInstructor.services.split(","), // transformando services em array
        created_At: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_At) // formatando data de cadastro
    }

    return res.render('instructors/show', { instructor })
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instructor not found!')

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render('instructors/edit', { instructor })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send('Instructor not found!')

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(foundInstructor.id)
    }

    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
        if (error) {
            return res.send('Write error!')
        }

        return res.redirect(`/instructors/${id}`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body
    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write file error')
        return res.redirect('/instructors')
    })
}