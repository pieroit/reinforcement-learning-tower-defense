import * as math from "mathjs"

class Qtable {

    constructor(inDimension, outDimension) {
        
        this.inDimension  = inDimension
        this.outDimension = outDimension

        // build empty Q table
        this.Q        = math.zeros([inDimension, outDimension])
        
        // set random action probability
        this.exploration = 0.9

        this.state  = 0
        this.action = 0

        this.totalRewards = 0
    }

    getAction(state) {

        // get action for this state
        let action
        if( Math.random() < this.exploration ) {
            action = Math.floor(Math.random() * this.outDimension)
        } else {
            let maxQ = math.max( this.Q[state] )
            action   = this.Q[state].indexOf(maxQ)
        }

        this.state  = state
        this.action = action
        
        return action
    }

    learn(reward, nextState) {

        let prediction    = this.Q[this.state][this.action]
        let target        = reward + math.max(this.Q[nextState])
        let error         = target - prediction
        let learningRate  = 0.01
        
        this.Q[this.state][this.action] += error * learningRate

        // slow down random actions
        this.exploration *= 0.99

        // update rewards record
        this.updateHUD(reward)
        
    }

    updateHUD(reward) {
        
        this.totalRewards += reward      

        let scoreEl = document.getElementById("rps")
        scoreEl.innerText = Math.round( this.totalRewards )

        let exploEl = document.getElementById("exploration")
        exploEl.innerText = Math.round(this.exploration*100) + '%'

        let tableEl = document.getElementById("qtable")
        tableEl.innerHTML = `<tr>
            <th>enemies</th><th>sniper</th><th>automatic</th><th>bomb</th>
        </tr>`

        for(let i=0; i<this.Q.length; i++){
            let rowEl = document.createElement("tr")
            tableEl.append(rowEl)
            rowEl.innerHTML += '<th>' + i + '</th>'
            for(let j=0; j<this.Q[i].length; j++){
                let cell = document.createElement("td")
                cell.innerText = Math.round(this.Q[i][j] * 100)/100
                rowEl.append(cell)
            }
        }
    }
}

export default Qtable