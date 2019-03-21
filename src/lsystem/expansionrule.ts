export default class ExpansionRule {
    // precondition: string;
    // expAction: any;
    // probability: number;
    // new_symbol: string;
    grammar: Map<string, Array<[string, number]>> = new Map<string, Array<[string, number]>>();

    constructor() {
    }

    createExpansionRules() {
        this.grammar.set("F", [["FFX-[F-F+]+-F+XF-F]", 0.4], 
                               ["FF", 0.6]]);
        this.grammar.set("X", [["F-[[X]+FX]-F[+X]", 0.3], 
                               ["X", 0.7]]);
    }

    map(str: string, xi: number) : string {
        if (this.grammar.has(str)) {
            let sumprob: number = 0;
            let probs = this.grammar.get(str);

            for (let i: number = 0; i < probs.length; i++) {
                sumprob += probs[i][1];
                if (xi <= sumprob) {
                    return probs[i][0];
                }
            }
        }
        else return "";
    }

    expand(axiom: string, iterations: number) : string {
        let ret: string = axiom;
        for (let i: number = 0; i < iterations; i++) {
            let exp: string = "";
            for (let j: number = 0; j < ret.length; j++) {
                let c: string = ret.charAt(j);
                // console.log("c: " + c);
                exp += this.map(c, Math.random());
            }
            ret = exp;
        }
        // console.log("expanded: " + ret);
        return ret;
    }

}
