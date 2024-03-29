import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Pressable,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import styles from './styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { module_1 } from '../questions/module_1.js';
import { module_2 } from '../questions/module_2.js';
import { module_3 } from '../questions/module_3.js';
import { module_4 } from '../questions/module_4.js';
import { module_5 } from '../questions/module_5.js';
import { module_6 } from '../questions/module_6.js';
import { module_7 } from '../questions/module_7.js';
import { module_8 } from '../questions/module_8.js';
import { module_9 } from '../questions/module_9.js';
import { module_10 } from '../questions/module_10.js';

//importing modules and appending them into an array for easy access
export default ({ route, navigation }) => {
    6;
    const { test } = route.params;
    const moduleList = [
        module_1,
        module_2,
        module_3,
        module_4,
        module_5,
        module_6,
        module_7,
        module_8,
        module_9,
        module_10,
    ];
    //hooks
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [showWrongAnswer, setShowWrongAnswer] = useState(false);
    //states to preserve the random numbers
    const [randomQuestionArray, setRandomQuestionArray] = useState(0);
    const [randomModuleArray, setRandomModuleArray] = useState(0);

    const randomModule = ~~(Math.random() * moduleList.length);
    const randomQuestion = ~~(Math.random() * 9);

    const [onContinue, setOnContinue] = useState(false);
    const nextQuestion = currentQuestion + 1;
    const precentage = (score / test) * 100;
    const dimensions = Dimensions.get('window');
    const imageHeight = dimensions.height / 2;
    const imageWidth = Math.round((dimensions.width * 9) / 16);
    //key for asyncstorage api
    const [key, setKey] = useState(0);

    const handleWrongAnswer = () => {
        setShowWrongAnswer(false);
        setOnContinue(true);
        if (nextQuestion < test) {
            setCurrentQuestion(nextQuestion);
            setShowWrongAnswer(false);
        } else {
            setShowScore(true);
        }
    };

    const handleAnswerButtonClick = (isCorrect) => {
        if (isCorrect) {
            setScore(score + 1);
            setShowWrongAnswer(false);
        }
        if (!isCorrect) {
            setShowWrongAnswer(true);
            setRandomModuleArray(randomModule);
            setRandomQuestionArray(randomQuestion);
        }

        if (nextQuestion < test && isCorrect) {
            setCurrentQuestion(nextQuestion);
            setShowWrongAnswer(false);
        } else if (!isCorrect) {
            setShowWrongAnswer(true);
        } else {
            setShowScore(true);
        }
    };
    //Store function for asyncstorage
    const storeData = async (precentage, score, test) => {
        const generateKey = ~~(Math.random() * 10000);

        
        const obj = {
            precentage: precentage,
            score: score,
            questionCount: test,
            key: generateKey,
        };
        try {
            await AsyncStorage.setItem(`score_${generateKey}`, JSON.stringify(obj));
        } catch (e) {
            // saving error
        }
    };
    const Bind = () => {
        storeData(precentage, score, test);
        navigation.navigate('Testisätted');
    };
    return (
        <View style={styles.questionContainer}>
            {showScore ? (
                <View style={styles.container}>
                    <Text style={styles.questionPanelText}>Tulemus:</Text>
                    <Text style={styles.preferenceText}>
                        {score}/{test} õigesti
                    </Text>
                    <Text style={styles.preferenceText}>
                        {Math.floor(precentage)}% õige
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed
                                    ? '#13293D'
                                    : '#1B98E0',
                            },
                            styles.button,
                        ]}
                        onPress={() => Bind()}>
                        <Text style={styles.text}>Edasi!</Text>
                    </Pressable>
                </View>
            ) : showWrongAnswer ? (
                <View>
                    <Text style={styles.wrongAnswerText}>Vale vastus!</Text>

                    <ScrollView style={styles.answerContainer}>
                        {moduleList[randomModuleArray][
                            randomQuestionArray
                        ].answerOptions.map((answerOption, i) => (
                            <Pressable
                                key={i}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed
                                            ? '#1B98E0'
                                            : answerOption.isCorrect
                                            ? 'green'
                                            : !answerOption.isCorrect
                                            ? 'red'
                                            : '#13293D',
                                    },
                                    styles.answerButton,
                                ]}>
                                <Text style={styles.answerText}>
                                    {answerOption.answerText}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed
                                        ? '#13293D'
                                        : '#1B98E0',
                                },
                                styles.button,
                            ]}
                            onPress={handleWrongAnswer}>
                            <Text style={styles.text}>Jätka!</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            ) : (
                <>
                    <Text style={styles.counterText}>
                        {currentQuestion + 1} / {test}
                    </Text>

                    <Text style={styles.questionPanelText}>
                        {moduleList[randomModule][randomQuestion].questionText}
                    </Text>

                    {moduleList[randomModule][randomQuestion].imgPath !==
                        undefined && (
                        <Image
                            style={{
                                flex: 1,
                                height: imageHeight,
                                width: imageWidth,
                            }}
                            source={
                                moduleList[randomModule][randomQuestion].imgPath
                            }
                        />
                    )}
                    <ScrollView style={styles.answerContainer}>
                        {moduleList[randomModule][
                            randomQuestion
                        ].answerOptions.map((answerOption, i) => (
                            <Pressable
                                key={i}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed
                                            ? '#13293D'
                                            : '#1B98E0',
                                    },
                                    styles.answerButton,
                                ]}
                                onPress={() =>
                                    setTimeout(function () {
                                        handleAnswerButtonClick(
                                            answerOption.isCorrect
                                        );
                                    }, 500)
                                }>
                                <Text style={styles.answerText}>
                                    {answerOption.answerText}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    );
};
