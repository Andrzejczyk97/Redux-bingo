import { isPartiallyEmittedExpression } from "typescript";
import { BingoAction, BingoState, BingoTicket} from "./types";

export const initialState: BingoState = {
    players: [],
    numbersDrawn: [],
    winners: [],
}; 

export function bingoReducer(state = initialState, action: BingoAction): BingoState {
    const ticketUniqueCheck:(ticket: BingoTicket) => boolean = (ticket: BingoTicket) => {
        const tempTicket:number[] = []
        ticket.forEach(row => {
            row.forEach(element => tempTicket.push(element))
        })
        const uniqueTemp = [...new Set(tempTicket)]
        if(uniqueTemp.length === tempTicket.length) return true
        else return false
    }
    const checkForWinners:(state: BingoState, nums: number[]) => string[] = (state: BingoState, nums: number[]) => {
        const winners: string[] = []
        state.players.forEach(player => {

            if(!state.winners.includes(player.name)){
            const ticketCopy: number[][] = JSON.parse(JSON.stringify(player.ticket))
            const numsCopy: number[] = [...nums, 99]
            ticketCopy[2].splice(2,0,99)

            //rows
            for (let i = 0; i < ticketCopy.length; i++) {
                if (ticketCopy[i].every((num) => numsCopy.includes(num))) {
                  winners.push(player.name);
                  break;
                }
            }
            //columns
            for (let i = 0; i < ticketCopy.length; i++) {
                const col = ticketCopy.map((row) => row[i]);
                if (col.every((num) => numsCopy.includes(num))) {
                  winners.push(player.name);
                  break;
                }
            }
            //diagonals
            const diagonal1 = ticketCopy.map((row, i) => row[i]);
            const diagonal2 = ticketCopy.map((row, i) => row[ticketCopy.length - i - 1]);
            if ( diagonal1.every((num) => numsCopy.includes(num)) || diagonal2.every((num) => numsCopy.includes(num)) ) {
                winners.push(player.name);
            }
        }
        })
        return winners
    }

    switch(action.type) { 
        case "registered":
            if(ticketUniqueCheck(action.payload.ticket)) {
            const newPlayer = {
                name: action.payload.name,
                ticket: action.payload.ticket
            }
            return {
                ...state,
                players: state.players.concat(newPlayer)
            }}
            else return state
        case "numberDrawn":
            if(state.numbersDrawn.includes(action.payload)) return state
            else {
                const allNumsDrawn: number[] = state.numbersDrawn.concat(action.payload)
                const newWinners: string[] = checkForWinners(state, allNumsDrawn);
                if(newWinners.length !=0) return {
                    ...state,
                    winners: state.winners.concat(newWinners),
                    numbersDrawn: allNumsDrawn
                    }
                else return {
                    ...state,
                    numbersDrawn: state.numbersDrawn.concat(action.payload)
                }
            }
    }
    return state
}