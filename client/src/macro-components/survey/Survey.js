// import { Link } from "react-router-dom";
import SubmitButton from "../../micro-components/submitButton/SubmitButton";

import { useSurveyLogic } from "./_SurveyLogic";

import "../../styles/css/macro-components/survey/Survey.css";

function Survey(props) {
    const voteLabel = "Vote";
    const nameLabel = "Name";
    const reasonLabel = "Reason";
    const namePadding = `${Number(nameLabel.length) * 1.3}rem`;
    const votePadding = `${Number(voteLabel.length) * 1.2}rem`;
    const reasonPadding = `${Number(reasonLabel.length) * 1.1}rem`;

    const {
        state: {
            formState: { reasonLineCount, isValid },
            submitState: { success, isSubmitting, feedback },
        },
        handlers: {
            handleSubmit,
            handleChangeName,
            handleChangeVote,
            handleChangeReason,
        },
    } = useSurveyLogic(props);

    return (
        <>
            <form
                className='Survey'
                onSubmit={handleSubmit}
                data-submitted={success}
                data-error={success === false}
            >
                <p className='instruction'>Please fill out the form below</p>

                <div className='container'>
                    <div
                        className='border'
                        style={{ "--lineCount": reasonLineCount }}
                    ></div>

                    <div className='inputField' id='name'>
                        <label htmlFor='name'>{nameLabel}</label>
                        <input
                            type='text'
                            name='name'
                            style={{ paddingLeft: namePadding }}
                            onChange={handleChangeName}
                        />
                        <div className='line' style={{ "--n": 0 }}></div>
                    </div>

                    <div className='inputField' id='vote'>
                        <label htmlFor='vote'>{voteLabel}</label>
                        <input
                            type='text'
                            name='vote'
                            style={{ paddingLeft: votePadding }}
                            onChange={handleChangeVote}
                        />
                        <div className='line' style={{ "--n": 0 }}></div>
                    </div>

                    <div className='inputField' id='reason'>
                        <label htmlFor='reason'>{reasonLabel}</label>
                        <textarea
                            type='text'
                            name='reason'
                            spellCheck={false}
                            style={{
                                "--lineCount": reasonLineCount,
                                textIndent: reasonPadding,
                            }}
                            onChange={handleChangeReason}
                        />
                        {Array(reasonLineCount)
                            .fill(null)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className='line'
                                    style={{ "--n": i, "--ni": i + 2 }}
                                ></div>
                            ))}
                    </div>
                </div>

                {feedback && (
                    <div className='feedback' data-error={success === false}>
                        {feedback}
                    </div>
                )}

                {!success && (
                    <SubmitButton disabled={!isValid || isSubmitting} />
                )}
            </form>
            {/* <Link to={"/admin"}>Admin Login</Link> */}
        </>
    );
}

export default Survey;
