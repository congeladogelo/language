import React, { useEffect, useState } from 'react';

import sentences from '../../languages/portuguese/language.sentences.json';
import pronouns from '../../languages/portuguese/language.pronouns.json';
import verbs from '../../languages/portuguese/language.verbs.json';
import adjectives from '../../languages/portuguese/language.adjectives.json';
import nouns from '../../languages/portuguese/language.nouns.json';
import functions from '../../languages/portuguese/language.functions.json';

export default function Translate() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [engToPort, setEngToPort] = useState(true);

  const handleInput = ({ target }) => {
    setInput(target.value);
  };

  const translate = () => {
    let from = 0;
    let to = 1;

    if (!engToPort) {
      from = 1;
      to = 0;
    }

    if (!input) {
      setOutput('');
      return;
    }

    for (let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex += 1) {
      if (sentences[sentenceIndex][from] === input) {
        setOutput(sentences[sentenceIndex][to]);
        return;
      }
    }

    const translation = [];

    const inputWords = input.trimEnd().toLowerCase().split(' ');

    inputWords.forEach((inputWord) => {
      functions.some((functionVariations) => {
        if (functionVariations[from] === inputWord) {
          translation.push({ type: 'function', value: functionVariations[to] });
          return true;
        }
        return false;
      });
      pronouns.some((pronounVariations) => {
        if (pronounVariations[from].includes(inputWord)) {
          translation.push({ type: 'pronoun', value: pronounVariations[to], order: pronounVariations[2] });
          return true;
        }
        return false;
      });
      verbs.some((verbVariations) => {
        if (verbVariations[from].includes(inputWord)) {
          translation.push({ type: 'verb', value: verbVariations[to] });
          return true;
        }
        return false;
      });
      nouns.some((nounVariations) => {
        if (nounVariations[from] === inputWord) {
          translation.push({ type: 'noun', value: nounVariations[to] });
          return true;
        }
        return false;
      });
      adjectives.some((adjectiveVariations) => {
        if (adjectiveVariations[from] === inputWord) {
          translation.push({ type: 'adjective', value: adjectiveVariations[to] });
          return true;
        }
        return false;
      });
    });

    for (let wordIndex = 0; wordIndex < translation.length; wordIndex += 1) {
      if (translation[wordIndex].type === 'adjective') {
        if (translation[wordIndex + 1]) {
          if (translation[wordIndex + 1].type === 'noun') {
            const firstWord = translation[wordIndex];
            const secondWord = translation[wordIndex + 1];
            translation[wordIndex] = secondWord;
            translation[wordIndex + 1] = firstWord;
          }
        }
      }
    }

    let translationString = '';

    let lastPronounOrder = 5;

    let pronounCount = 0;

    translation.forEach((word) => {
      if (word.type === 'pronoun') {
        if (pronounCount > 0) {
          translationString += word.value[1];
        } else {
          translationString += word.value[0];
        }
        lastPronounOrder = word.order;
        pronounCount += 1;
      } else if (word.type === 'verb') {
        translationString += word.value[lastPronounOrder];
      } else {
        translationString += word.value;
      }

      translationString += ' ';
    });

    setOutput(translationString);
  };

  useEffect(() => {
    translate();
  }, [input]);

  return (
    <div>
      <input
        value={input}
        onChange={handleInput}
        style={{
          width: '500px',
          height: '40px',
        }}
      />
      <nobr />
      <p>{output}</p>
      <button
        type="button"
        onClick={() => {
          setEngToPort(!engToPort);
          setInput(output);
          setOutput(input);
        }}
      >
        {engToPort ? 'english > portuguese' : 'portuguese > english'}
      </button>
    </div>
  );
}
