import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())

app.use(express.json())

let listaDeVeiculos = []
let proximoId = 1
let usuarios = []
let proximoUsuario = 1

app.post('/veiculos',(request,response)=>{
   const modelo = request.body.modelo
   const marca = request.body.marca
   const ano = Number(request.body.ano)
   const cor = request.body.cor
   const preco = Number(request.body.preco)

    if(!modelo){
        response.status(400).send('Passe um modelo de veículo válido')
    }

    if(!marca){
        response.status(400).send('Passe uma marca de veículo válido')
    }

    if(!ano){
        response.status(400).send('Passe o ano do veículo válido')
    }

    if(!cor){
        response.status(400).send('Passe uma cor válida para o veículo')
    }

    if(!preco){
        response.status(400).send('Passe um preço de veículo válido')
    }
     
    if (modelo && marca && ano && cor && preco ) {
        let novoVeiculo ={
            id:proximoId,
            modelo:modelo,
            marca:marca,
            ano:ano,
            cor:cor,
            preco:preco
        }
    
        listaDeVeiculos.push(novoVeiculo)
        proximoId++
    
        response.status(201).send(`
        ID: ${novoVeiculo.id} | Modelo ${novoVeiculo.modelo} | Marca: ${novoVeiculo.marca} | Ano: ${novoVeiculo.ano} | Cor: ${novoVeiculo.cor} | Preço: R$ ${novoVeiculo.preco}`) 
        }else{
            response.status(400).send('Erro! Revise suas informações.')
        }})    

app.get('/veiculos',(request,response)=>{
    if(listaDeVeiculos.length === 0){
        response.status(404).send('Não existe veículo cadastrado.') 
    }    

    const veiculosCadastrados = listaDeVeiculos.map((veiculo) => `ID: ${veiculo.id} | Modelo: ${veiculo.modelo} | Marca: ${veiculo.marca} | Ano: ${veiculo.ano} | Cor: ${veiculo.cor} | Preço: R$ ${veiculo.preco}`)

    response.status(200).send(veiculosCadastrados)
})

app.get('/veiculosBuscar', (request, response) => {
    const marcaFiltrada = request.query.marca;

    const veiculosFiltrados = listaDeVeiculos.filter(veiculo => veiculo.marca === marcaFiltrada);

    if (veiculosFiltrados.length > 0) {
        response.status(200).send(veiculosFiltrados);
    } else {
        response.status(404).send('Não há veículos cadastrados desta marca.');
    }
})



//-------------------------4.ATUALIZAR------------------------------------------ 

//http://localhost:3333/veiculos/:idBuscado
app.put("/veiculos/:idBuscado", (request, response) => {
    const modelo = request.body.modelo
    const marca = request.body.marca
    const ano = request.body.ano
    const cor = request.body.cor
    const preco = request.body.preco

    const idBuscado = Number(request.params.idBuscado)

    if (!idBuscado) {
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um ID válido" }))
    }

    const idVerificado = listaDeVeiculos.findIndex((veiculo) => veiculo.id === idBuscado)

    if (idVerificado === -1) {
        response.status(400).send(JSON.stringify({ Mensagem: "Veículo não encontrado. O usuário deve voltar para o menu inicial." }))
    }

    if (idVerificado !== -1){
        const carro = listaDeVeiculos[idVerificado]
        carro.cor = cor
        carro.preco = preco

        

        response.status(200).send(JSON.stringify({ Mensagem: `Veículo ${carro.modelo} (${carro.marca} ${carro.ano}) atualizado com sucesso.` }));

    }
})

//-------------------------5 - Crie um Endpoint Remover veículo----------------

//http://localhost:3333/veiculos/:idBuscado

app.delete('/veiculos/:idBuscado', (request, response) => {
    const idBuscado = Number(request.params.idBuscado)

    if(!idBuscado){
        return response.status(400).send(JSON.stringify({ Mensagem: "Veículo, não encontrado. O usuário deve voltar para o menu inicial depois" }))
    }

    const identificadorVeiculos = listaDeVeiculos.findIndex(veiculo =>(veiculo.id === idBuscado)) 
 

    if(identificadorVeiculos === -1){
         response.status(400).send(JSON.stringify({ Mensagem: "Identificador de veículos não encontrado" }))
    }else{
        listaDeVeiculos.splice(identificadorVeiculos,1)
        response.status(200).send(JSON.stringify({ Mensagem: "Veículo deletado com sucesso" }))
    }
})

//-------------------------6 - Crie um Endpoint Criar uma pessoa usuária-------

app.post('/signup', async (request, response)=>{

    const data = request.body
    const nome = data.nome
    const email = data.email
    const senhaDigitada = data.senhaDigitada
    
    if(!nome){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um nome válido" }))
    }

    if(!email){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um email válido" }))
    }

    if(!senhaDigitada){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar uma senha válido" }))
    }

    const verificarEmail = usuarios.find(usuario=> usuario.email === email)
    
    if(verificarEmail){
        response.status(400).send(JSON, stringify({Mensagem: `Email já cadastrado no nosso banco de dados.`}))
    }

    const senhaCriptografada = await bcrypt.hash(senhaDigitada, 10)

    let usuario = {
    
        id : proximoUsuario, 
        nome : request.body.nome,
        email : request.body.email,
        senhaDigitada : senhaCriptografada
    }

    usuarios.push(usuario)

    proximoUsuario++

    response.status(201).send(JSON.stringify({Mensagem: `Pessoa de email ${email}, cadastrada com sucesso.`}))
})

//-------------------------7 - Crie um Endpoint logar uma pessoa usuária-------

app.post('/login',async(request,response)=>{
    const data = request.body 
  
    const email = data.email 
    const senhaDigitada = data.senha
  
    if(!email){
      response.status(400).send(JSON.stringify({ Mensagem: "Favor inserir um email válido" }))
    }
  
    if(!senhaDigitada){
      response.status(400).send(JSON.stringify({ Mensagem: "Favor inserir uma senha válida" }))
    }
  
    const usuario = usuarios.find(usuario =>usuario.email === email)

    console.log(senhaDigitada)
    console.log(usuario)
  
    const senhaMatch = await bcrypt.compare(senhaDigitada,usuario.senhaDigitada)

    console.log(senhaMatch)
  
    if(!senhaMatch){
      response.status(400).send(JSON.stringify({ Mensagem: "Senha não encontrada em nosso banco.Credencial inválida" }))
    }
  
    response.status(200).send(JSON.stringify({ Mensagem: `Pessoa com email ${email}, foi logada com sucesso! Seja Bem-vinde!` }))
})






app.listen(3333, ()=> console.log("Servidor rodando na porta 3333"))