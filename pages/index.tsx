import Head from 'next/head';
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import 'survey-core/defaultV2.min.css';
import "survey-core/i18n/german";
import {Model, SurveyModel} from "survey-core";
import {Survey} from "survey-react-ui";
import {useCallback, useState} from "react";

const surveyJson = {
    pages: [{
        elements: [{
            name: "name",
            title: "Was ist dein Name?",
            type: "text"
        },
            {
                name: "auslaendar",
                title: "Bist du ausländer?",
                type: "boolean",
                isRequired: true
            }]
    }, {
        elements: [{
            name: "cap",
            title: "Welche Cap würdest du tragen?",
            type: "radiogroup",
            choices: ['Gucci', 'NY Yankees', 'Tommy Hilfiger'],
            isRequired: true
        }],
    }, {
        elements: [{
            name: "fahrzeug",
            title: "Welches Fahrzeug?",
            type: "radiogroup",
            choices: ['Mercedes', 'E-Roller', 'Bus'],
            isRequired: true
        }],
    }, {
        elements: [{
            name: "frau",
            title: "Wie bezeichnest du eine Frau?",
            type: "radiogroup",
            choices: ['Erwachsener, weiblicher Mensch', 'Chaya', 'Schatztruhe', 'Liebling', 'Shawty'],
            isRequired: true
        }],
    }, {
        elements: [{
            name: "sachen",
            title: "Wo tust du deine Sachen rein?",
            type: "text",
            isRequired: true
        }]
    }, {
        elements: [{
            name: "skala",
            title: "Auf einer Skala von 1-10, wie Talahonisch war dieses Quiz?",
            type: "rating",
            rateMin: 5,
            rateMax: 10
        }]
    }]
};

export default function Home() {
    const survey = new Model(surveyJson)
    const [finished, setFinished] = useState(false)
    const maxScore = 5;
    const [score, setScore] = useState(0)

    survey.locale = "de";

    const surveyComplete = useCallback((survey: SurveyModel) => {
        setFinished(true)
        const {auslaendar, fahrzeug, frau, cap, sachen} = survey.data;
        let score = 0;

        if(auslaendar === true) score++;
        if(fahrzeug === 'E-Roller') score++;
        if(frau === 'Chaya') score++;
        if(cap === 'Gucci') score++;
        if(sachen.toLowerCase() === 'bauchtasche') score++;

        setScore(score / maxScore * 100);
    }, []);

    async function share() {
        await navigator.share({
            url: 'https://talahon.benherbst.net/'
        })
    }

    function repeat() {
        survey.clear()
        setFinished(false)
    }

    survey.onComplete.add(surveyComplete)

    return (
        <div>
            <Head>
                <title>Talahon-Check - Check ob du ein Talahon bist!</title>
                <meta name="description"
                      content="Mit Talahon-Check kann jeder checken ob er oder sie ein Talahon ist. Seite bitte mit 100% ironie verstehen."/>
                <meta property="og:title" content="Talahon-Check - Check ob du ein Talahon bist!" key="title"/>
                <meta property="og:description"
                      content="Mit Talahon-Check kann jeder checken ob er oder sie ein Talahon ist. Seite bitte mit 100% ironie verstehen."/>
                <meta name="theme-color" content="#000"/>
            </Head>
            <header css={css`
                background-color: #000;
                padding: 1.5rem;
            `}>
                <p css={css`
                    font-size: 2rem;
                    text-align: center;
                    margin: 0;
                    color: #FFF;
                `}>
                    <strong>
                        TALAHON-CHECK
                    </strong>
                </p>
            </header>
            {!finished && <Survey model={survey}/>}
            {finished && <section css={css`
                text-align: center;
                max-width: 640px;
                margin: auto;
                padding: 24px;
            `} id='ergebnis'>
                <div css={css`
                    background-color: #FFF;
                    padding: 4rem 2rem;
                    border-radius: 1rem;
                `}>
                    <span>Du bist zu</span>
                    <h2>{score}%</h2>
                    <span>ein Talahon!</span>
                    <div css={css`
                        padding-top: 4rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    `}>
                        <button onClick={repeat}>Nochmal</button>
                        <button onClick={share}>Teilen</button>
                    </div>
                </div>
            </section>}
            <p css={css`
                max-width: 640px;
                margin: auto;
                padding: 0 24px;
            `}>Made by <a href="https://www.benherbst.net/">Ben Herbst</a>.</p>
        </div>
    );
}
