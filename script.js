const promptSync = require("prompt-sync")
const mysql = require("mysql2")

const prompt = promptSync({ sigint: true })

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Etec", 
    database: "gerenciador_de_tarefas",
    port: 3306,        
    connectTimeout: 20000 
});

db.connect(erro => {
    if (erro) throw erro;  
    console.log("Conectado com sucesso!")
});

function adicionarTarefas() {
    const nome = prompt("Digite a nova tarefa: ");
    const dificuldade = prompt("Insira a dificuldade da tarefa (Fácil, Médio, Difícil): ")
    const sql = "INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)"
    db.query(sql, [nome, dificuldade], (erro, resultado) => {
        if (erro) throw erro
        console.log("Tarefa adicionada com sucesso!\n")
    });
}

function listarTarefas() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tarefas";
        db.query(sql, (erro, resultado) => {
            if (erro) return reject(erro);
            console.log("-- Tarefas a fazer --")
            console.log("------------------------------")
            if (resultado.length === 0) {
                console.log("Nenhuma tarefa adicionada.\n")
                return resolve(resultado);
            }
            
            resultado.forEach(tarefa => {
                console.log(`ID ${tarefa.id}: ${tarefa.resposta} || Dificuldade: ${tarefa.dificuldade}`)
            })
            resolve(resultado);
        })
    })
}

async function deletarTarefa() {
    await listarTarefas() 

    const deletar = parseInt(prompt("Digite o ID da tarefa que deseja deletar: "))
    const sql = "DELETE FROM tarefas WHERE id = ?"

    db.query(sql, [deletar], (erro, resultado) => {
        if (erro) throw erro
        if (resultado.affectedRows === 0) {
            console.log("[ERRO] Essa task não existe.")
        } else {
            console.log("Tarefa excluída!")
        }
    })
}

function main() {
    let cont = -1
    do {
        console.log("----------------------------------")
        console.log("-- Gerenciador de tarefas --")
        console.log("----------------------------------")
        console.log("1- Adicionar tarefa")
        console.log("2- Deletar tarefa")
        console.log("3- Listar tarefas")
        console.log("0- Sair")
        cont = parseInt(prompt("Escolha uma das opções: "))

        switch (cont) {
            case 1: adicionarTarefas(); break;
            case 2: deletarTarefa(); break;
            case 3: listarTarefas(); break;
            case 0: console.log("Saindo..."); db.end(); break;
            default: console.log("[ERRO] Opção inválida!"); break;
        }
    } while (cont !== 0)
}

main();
