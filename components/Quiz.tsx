import React from "react";

type QuizProps = {
	// keep a broad, compatible props surface so parent logic remains authoritative
	currentQuestions?: any[];
	currentQuestionIndex?: number;
	onAnswer?: (answer: any) => void;
	difficulty?: number;
	power?: number;
	setPower?: (p: number) => void;
	threatLevel?: number;
	setThreatLevel?: (t: number) => void;
	onFailure?: () => void;
	onPause?: () => void;
	import React from "react";

	type QuizProps = {
	  // keep a broad, compatible props surface so parent logic remains authoritative
	  currentQuestions?: any[];
	  currentQuestionIndex?: number;
	  onAnswer?: (answer: any) => void;
	  difficulty?: number;
	  power?: number;
	  setPower?: (p: number) => void;
	  threatLevel?: number;
	  setThreatLevel?: (t: number) => void;
	  onFailure?: () => void;
	  onPause?: () => void;
	  night?: number;
	  isEndless?: boolean;
	  streak?: number;
	  question?: string;
	};

	export default function Quiz(props: QuizProps) {
	  const { question = "", onAnswer } = props;

	  const handleClick = (ans: string) => {
	    onAnswer?.(ans);
	  };

	  return (
	    <div className="quiz">
	      <h3>Quiz</h3>
	      <p>{question || "No question provided."}</p>
	      <div>
	        <button onClick={() => handleClick("A")}>A</button>
	        <button onClick={() => handleClick("B")}>B</button>
	        <button onClick={() => handleClick("C")}>C</button>
	        <button onClick={() => handleClick("D")}>D</button>
	      </div>
	    </div>
	  );
	}