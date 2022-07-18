/*server.js*/
const express = require("express");
const cors = require("cors");
const app = express();

var updateGame = [];
var lastPlayed;

app.use(cors());
const PORT = 8000;
const stocks = [
  { id: 1, ticker: "AAPL", price: 497.48 },
  { id: 2, ticker: "MSFT", price: 213.02 },
  { id: 3, ticker: "AMZN", price: 3284.72 },
];

class Descarte {
    constructor(id, card) {
        this.id = id;
        this.card = card;
    }

    playerId()
    {
        return this.id;
    }

    carta()
    {
        return parseInt(this.card);
    }
    
    getDescarte()
    {
        return {id: this.id, card: this.card};
    }

}

class Player {
    
    constructor(name,id) {
        this.name = name;
        this.uno = false;
        this.cards = [];
        this.id = id;
    }

    nombre()
    {
        return this.name;
    }

    cartas(){
        return this.cards;
    }
    
    addCard(card_index)
    {
        this.cards.push(card_index);
        this.uno = false;
    }
    
    counterCards()
    {
        return this.cards.length;
    }

    removeCard(card_index)
    {

        let pos = this.cards.indexOf(card_index);
        for(var i = 0; i < this.cards.length; i++)
        {
            if(this.cards[i] == card_index)
            {
                this.cards.splice(i, 1);
                return;
            }
        }        
    }

    saysUno()
    {
        if(this.cards.length == 1)
        {
            this.uno = true;
        }
    }
    
    saidUno()
    {
        return this.uno;
    }

    getId()
    {
        return this.id;
    }

}

class Game {
    constructor(){
        this.players = [];
        this.maso = [];
        this.descarte = [];
        this.lastDescarte = null;
        this.logged = "";
    }

    mezclarPilaMaso()
    {
        this.descarte.forEach(function(carta)
        {
            this.maso = this.maso.concat(carta.card);
        },this);
        this.descarte = [];
        this.descartePila(0,this.maso.pop());
        this.maso = this.shuffle(this.maso);
        
        
    }

    setPlayer(name,id)
    {
        this.players.push(new Player(name,id));
    }

    shuffle(arr) {
        var i,
            j,
            temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;    
    }

    descartePila(id,card) {
        if(id > 0)
        {
            this.players.forEach(function(player) {
                if(player.getId() == id)
                {
                    player.cartas().forEach(function(carta) {
                        if(carta == card)
                        {
                            this.lastDescarte = (new Descarte(id,card)).getDescarte();
                            this.descarte.push(this.lastDescarte);
                            player.removeCard(card);
                            return;
                        }
                    },this);
                    return;
                }
            },this);
        }
        else
        {

            this.lastDescarte = (new Descarte(id,card)).getDescarte();
            this.descarte.push(this.lastDescarte);
        }
        //console.log(this.descarte);
    }

    getPlayerId(name)
    {
        var id = 0;
        this.players.forEach(function(player) {
                if(player.nombre() == name)
                {
                    id = player.getId();
                }
        });

        return id;
    }

    startGame(cardsLen,cardsPerPlayer)
    {
        for(var i = 0; i < cardsLen; i++)
        {
            this.maso.push(i);
        }
        this.maso = this.shuffle(this.maso);
        this.players.forEach(function(player,index) {
            for(var i = 0; i < cardsPerPlayer; i++)
            {
                let ultimo = this.maso[this.maso.length - 1]
                this.maso.pop();
                player.addCard(ultimo);
                //console.log("undefined:" + this.maso);
            }
        },this);
        this.descartePila(0,this.maso.pop());
    }    

    addCartToPlayer(id)
    {
        if(this.maso.length > 0)
        {
            this.players.forEach(function(player) {
                if(player.getId() == id)
                {
                    player.addCard(this.maso.pop());
                    return;
                }
            },this);
        }
    }    

    deshacerJugada()
    {
        if(this.descarte.length > 1)
        {
            let id = this.lastDescarte.id;
            let card = this.lastDescarte.card;
            this.maso.push(card);
            this.addCartToPlayer(id);
            this.descarte.pop();
            this.lastDescarte = this.descarte[this.descarte.length - 1];
        }
    }

    getLaPila()
    {
        return this.descarte.slice(-3);
        return this.lastDescarte.card;
    }
    
    outputCards()
    {
        var descarteTemp = [];
        this.players.forEach(function(player) {
            console.log(player.nombre() + " : " + player.cartas());
        });
        
        this.descarte.forEach(function(descarte) {
            descarteTemp.push(descarte.card);
        });
        console.log("pila : " + descarteTemp);

        console.log("maso : " + this.maso);
    }

    outputCardsText()
    {
        var data = [];
        var descarteTemp = [];
        this.players.forEach(function(player) {
            data.push(player.nombre() + " : " + player.cartas());
        });
        
        this.descarte.forEach(function(descarte) {
            descarteTemp.push(descarte.carta());
        });
        data.push("pila : " + descarteTemp);

        data.push("maso : " + this.maso);
        return data;
    }

    updateHand(playerId)
    {
        var data = [];
        var salida;
        
        this.players.forEach(function(player) {

            if(player.getId() == playerId)
            {
                data.push(player.nombre() + " : " + player.cartas());
                salida = player.cartas();
                return;
            }
        });
        return salida;
    }


    saysUno(playerId)
    {
        this.players.forEach(function(player) {
            if(player.getId() == playerId)
            {
                player.saysUno();
                return;
            }
        });
    }
    saidOne()
    {
        var data = [];
        this.players.forEach(function(player) {
            if(player.saidUno() == true)
            {
                data.push(player.nombre());
            }
        });        
        return data;
    }
    getPlayersMano()
    {
        var data = [];
        this.players.forEach(function(player) {
                data.push({ id: player.getId(), nombre: player.nombre(), cartas: player.cartas(), uno: player.saidUno()});
        });
        return data;
    }

    lastHand(id,card,rise)
    {
        var salida = "nada";
        this.players.forEach(function(player) {
            
            if(player.getId() == id)
            {
                salida = player.nombre() + ":";
                if(rise){salida+="levanto";}
                if(card){salida+="jugo";}
                return;
            }
        });
        this.logged = salida;
        return salida;
    }

    getLastHand()
    {
        return this.logged;
    }
    
}

var elJuego = null;

function getRandomStock() {
  return Math.round(Math.random() * (2 - 0) + 0);
}
function getRandomPrice() {
  return Math.random() * (5000 - 20) + 20;
}

function updateAllGame()
{

    if(elJuego!=null)
    {
        updateGame.forEach(function(res) {
           res.write("data:" +
            JSON.stringify({ success: true, pila: elJuego.getLaPila(), players: elJuego.getPlayersMano(),last: elJuego.getLastHand()})
            );
            res.write("\n\n");
        });   

    }
}

app.get("/hand",function (req, res) {
    request = req.query;

if(elJuego != null){

    if((request['card'])){
        elJuego.descartePila(request['id'],request['card']);
    }
    if((request['rise'] == 1)){
        elJuego.addCartToPlayer(request['id']);
    }
    if((request['uno'] == 1)){
        elJuego.saysUno(request['id']);
    }

    lastPlayed = elJuego.lastHand(request['id'],request['card']?true:false,request['rise']?true:false);

    updateAllGame();

  res.status(200).json({ success: true, hand: elJuego.updateHand(request['id']), pila: elJuego.getLaPila(), players: elJuego.getPlayersMano(), last: lastPlayed});
}
});



app.get("/handhook",function (req, res) {

  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

    request = req.query;

    console.log("handhook");
    updateGame.push(res);
    updateAllGame();

    /*setInterval(() => {

    if(elJuego != null)
    {
    res.write(
      "data:" +
        JSON.stringify({ success: true, pila: elJuego.getLaPila(), players: elJuego.getPlayersMano()})
    );
    res.write("\n\n");
    }
  }, 200);*/

});

app.get("/newgame", function (req, res) {
    request = req.query;
    var flagOk=0;

    if((request['player'])){
        flagOk++;
    }
    if((request['cartas'])){
        flagOk++;
    }

    if(flagOk==2)
    {
        updateGame = [];
       elJuego = new Game();

        Object.keys(request['player']).forEach(function(player) {
            //elJuego.setPlayer(player.nombre,player.id);
            elJuego.setPlayer(request['player'][player],player);
            
        });  
        
        elJuego.startGame(request['cartas'],7);
        elJuego.outputCards();
    }
    updateAllGame();
  res.status(200).json({ success: true });
});

app.get("/back", function (req, res) {
    elJuego.deshacerJugada();
updateAllGame();
  res.status(200).json({ success: true });
});

app.get("/mezclar", function (req, res) {
    elJuego.mezclarPilaMaso();
updateAllGame();
  res.status(200).json({ success: true });
});

app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
    /*elJuego.setPlayer("seba",1);
    elJuego.setPlayer("cuco",2);
    elJuego.setPlayer("toro",3);
    
    elJuego.startGame(52,7);
    elJuego.outputCards();*/
});
