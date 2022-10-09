import { useRef, useState } from 'react';
import { Prompt } from 'react-router-dom'

import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import classes from './QuoteForm.module.css';

const QuoteForm = (props) => {
  const [isEntering, setIsEntering] = useState(false)
  const authorInputRef = useRef();
  const textInputRef = useRef();

  const submitFormHandler = (event) => {
    event.preventDefault();

    const enteredAuthor = authorInputRef.current.value;
    const enteredText = textInputRef.current.value;

    // optional: Could validate here

    props.onAddQuote({ author: enteredAuthor, text: enteredText });
  }

  // 사용자가 양식에서 작업하고 있음을 확인
  const formFocusedHandler = () => {
    setIsEntering(true)
  }

  const finishEnteringHandler = () => {
    setIsEntering(false)
  }

  return (
    <>
    <Prompt 
      when={isEntering} 
      message={(location) => 
        'Are you sure you wnat to leave? All your entered data will be lost!'}
      />
    <Card>
      <form 
        className={classes.form} 
        onSubmit={submitFormHandler} 
        onFocus={formFocusedHandler}
      >
        {props.isLoading && (
          <div className={classes.loading}>
            <LoadingSpinner />
          </div>
        )}

        <div className={classes.control}>
          <label htmlFor='author'>Author</label>
          <input type='text' id='author' ref={authorInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='text'>Text</label>
          <textarea id='text' rows='5' ref={textInputRef}></textarea>
        </div>
        <div className={classes.actions}>
          <button className='btn' onClick={finishEnteringHandler}>Add Quote</button>
        </div>
      </form>
    </Card>
    </>
  );
};

export default QuoteForm;
