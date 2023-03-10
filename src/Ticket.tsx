import * as React from "react";
import { BingoTicket } from "./types";
import {useDispatch, useSelector} from "react-redux";
import { BingoState } from "./types";
export function Ticket({ numbers, name }: Props) {
    const drawnNumbers = useSelector((state: BingoState) => state.numbersDrawn)
    return (
        <div data-role="ticket">
            <h4>{name}</h4>
            <div className="ticketNumbers">
                {numbers.map((col, i) => {
                    return col.map((num, j) => {
                        const isDrawn = (num: number ) => {
                            if (drawnNumbers.includes(num)) return true
                            else return false
                        };
                        return (
                            <React.Fragment key={`${i} + ${j}`}>
                                <div className={`num ${isDrawn(num) ? "marked" : ""}`}>{num}</div>
                                {i === 2 && j === 1 ? <div>*</div> : null}
                            </React.Fragment>
                        );
                    });
                })}
            </div>
        </div>
    );
}

interface Props {
    numbers: BingoTicket;
    name: string;
}
