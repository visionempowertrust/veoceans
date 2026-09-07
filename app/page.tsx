"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  name: string;
  kind: "ocean life" | "rubbish";
  description: string;
  features: string[];
};

const trainingItems: Item[] = [
  { name: "Clownfish", kind: "ocean life", description: "A small fish with an oval body, orange colouring, and three pale bands.", features: ["swims", "fins", "living"] },
  { name: "Plastic bottle", kind: "rubbish", description: "A clear plastic drinks bottle drifting on its side, with a blue cap.", features: ["floats", "plastic", "not living"] },
  { name: "Green sea turtle", kind: "ocean life", description: "A large turtle with four broad flippers and a patterned shell.", features: ["swims", "flippers", "living"] },
  { name: "Crumpled can", kind: "rubbish", description: "A dented silver drinks can resting below the surface.", features: ["sinks", "metal", "not living"] },
  { name: "Moon jelly", kind: "ocean life", description: "A translucent jellyfish with a round bell and short tentacles.", features: ["drifts", "tentacles", "living"] },
  { name: "Shopping bag", kind: "rubbish", description: "A thin white plastic bag floating like a jellyfish.", features: ["drifts", "plastic", "not living"] },
];

const testItems: Item[] = [
  { name: "Blue tang", kind: "ocean life", description: "A flat-bodied blue fish with fins and a yellow tail.", features: ["swims", "fins", "living"] },
  { name: "Glass jar", kind: "rubbish", description: "An empty transparent jar sinking upright.", features: ["sinks", "glass", "not living"] },
  { name: "Octopus", kind: "ocean life", description: "A reddish octopus with a rounded head and eight arms.", features: ["swims", "arms", "living"] },
  { name: "Bottle cap", kind: "rubbish", description: "A small red plastic cap floating at the surface.", features: ["floats", "plastic", "not living"] },
];

function speak(text: string, rate: number, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.onend = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [rate, setRate] = useState(1);
  const [autoRead, setAutoRead] = useState(true);
  const [status, setStatus] = useState("Welcome. Choose Start lesson when you are ready.");
  const mainRef = useRef<HTMLElement>(null);

  const current = trainingItems[index];
  const complete = labels.length === trainingItems.length;

  const read = (text: string) => {
    setStatus(text);
    speak(text, rate);
  };

  const itemScript = (item: Item, itemIndex: number) =>
    `Training example ${itemIndex + 1} of ${trainingItems.length}. ${item.name}. ${item.description} Is this ocean life or rubbish? Press O for ocean life, or R for rubbish.`;

  useEffect(() => {
    if (started && !testing && current && autoRead) {
      const timer = window.setTimeout(() => read(itemScript(current, index)), 250);
      return () => window.clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, index, testing]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!started || testing || complete) return;
      if (event.key.toLowerCase() === "o") choose("ocean life");
      if (event.key.toLowerCase() === "r") choose("rubbish");
      if (event.key === " ") {
        event.preventDefault();
        read(itemScript(current, index));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, testing, complete, index, labels]);

  function choose(label: "ocean life" | "rubbish") {
    const isCorrect = label === current.kind;
    const nextLabels = [...labels, label];
    setLabels(nextLabels);
    const feedback = `${label} selected. ${isCorrect ? "This label matches the example." : "This label does not match the example. The model will still learn from it."}`;
    if (index < trainingItems.length - 1) {
      setStatus(`${feedback} Moving to the next example.`);
      if (!autoRead) speak(feedback, rate);
      setIndex(index + 1);
    } else {
      setStatus(`${feedback} Training complete. You supplied ${nextLabels.length} examples.`);
      speak(`${feedback} Training complete. Choose test my model to hear how it performs.`, rate);
    }
  }

  function startLesson() {
    setStarted(true);
    setStatus("Lesson started. Your first training example is ready.");
    window.setTimeout(() => mainRef.current?.focus(), 50);
  }

  function testModel() {
    setTesting(true);
    setTested(0);
    const correctLabels = labels.filter((label, i) => label === trainingItems[i].kind).length;
    const score = correctLabels / trainingItems.length;
    const correctTests = Math.max(1, Math.round(score * testItems.length));
    const intro = `Testing begins. Your model learned from ${labels.length} examples, ${correctLabels} labelled as expected. It correctly sorts ${correctTests} of ${testItems.length} new objects. This simple simulation shows that clearer, more varied training data usually makes a model more dependable.`;
    setStatus(intro);
    speak(intro, rate, () => setTested(correctTests));
  }

  function resetLesson() {
    window.speechSynthesis?.cancel();
    setStarted(false);
    setTesting(false);
    setIndex(0);
    setLabels([]);
    setTested(0);
    setStatus("Lesson reset. Choose Start lesson when you are ready.");
  }

  return (
    <div className={`${highContrast ? "high-contrast" : ""} ${largeText ? "large-text" : ""}`}>
      <a className="skip-link" href="#lesson">Skip to lesson</a>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Ocean Learner home">
          <span className="brand-mark" aria-hidden="true">≈</span>
          <span>Ocean Learner</span>
        </a>
        <button className="quiet-button" onClick={() => read("Keyboard help. Tab moves through controls. Enter activates a button. During training, press O for ocean life, R for rubbish, or Space to hear the current object again.")}>
          Keyboard help
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow">Audio-first interactive lesson · About 10 minutes</div>
          <h1 id="hero-title">Teach a machine.<br /><em>Protect an ocean.</em></h1>
          <p className="hero-copy">Explore how machine learning finds patterns—without needing to see a single image. Every visual is described, every action works from the keyboard, and every step can be spoken aloud.</p>
          {!started ? (
            <div className="hero-actions">
              <button className="primary-button" onClick={startLesson}>Start lesson <span aria-hidden="true">→</span></button>
              <button className="listen-button" onClick={() => read("Welcome to Ocean Learner. In this ten minute lesson, you will train a simple machine learning model to sort ocean life from rubbish. Every picture has a full text description. You can complete the whole activity with a keyboard and listen to each step.")}>
                <span aria-hidden="true">▶</span> Listen to introduction
              </button>
            </div>
          ) : (
            <div className="progress-wrap" aria-label={`Lesson progress: ${testing ? 3 : complete ? 2 : 1} of 3 stages`}>
              <span>1. Learn</span><span>2. Train</span><span>3. Test</span>
              <div className="progress-track"><div style={{ width: testing ? "100%" : complete ? "66%" : "33%" }} /></div>
            </div>
          )}
        </section>

        <section className="lesson-shell" id="lesson" ref={mainRef} tabIndex={-1} aria-labelledby="lesson-title">
          <aside className="settings" aria-label="Accessibility settings">
            <p className="settings-title">Make it yours</p>
            <label className="switch-row"><span><strong>Read each step</strong><small>Automatic spoken guidance</small></span><input type="checkbox" checked={autoRead} onChange={(e) => setAutoRead(e.target.checked)} /></label>
            <label className="switch-row"><span><strong>High contrast</strong><small>Sharper colours and borders</small></span><input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} /></label>
            <label className="switch-row"><span><strong>Larger text</strong><small>Increase all lesson text</small></span><input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} /></label>
            <label className="rate-row" htmlFor="speech-rate"><strong>Speech speed</strong><span>{rate.toFixed(1)}×</span></label>
            <input id="speech-rate" type="range" min="0.7" max="1.4" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </aside>

          <article className="activity-card">
            {!started ? (
              <div className="empty-state">
                <div className="sonar" aria-hidden="true"><i /><i /><b>●</b></div>
                <p className="step-kicker">Your mission</p>
                <h2 id="lesson-title">Help the cleaner learn</h2>
                <p>An underwater cleaner needs examples before it can tell sea creatures from rubbish. You will be its teacher.</p>
                <ol className="mission-list">
                  <li><b>Listen</b> to a detailed object description.</li>
                  <li><b>Label</b> it as ocean life or rubbish.</li>
                  <li><b>Test</b> what the model learned from you.</li>
                </ol>
              </div>
            ) : !complete ? (
              <div>
                <div className="step-head"><span>Training example {index + 1} of {trainingItems.length}</span><button onClick={() => read(itemScript(current, index))} aria-label={`Listen to description of ${current.name}`}>▶ Read aloud</button></div>
                <div className="object-stage" aria-describedby="object-description">
                  <div className={`object-symbol ${current.kind === "rubbish" ? "rubbish" : "life"}`} aria-hidden="true">{current.kind === "rubbish" ? "▱" : "◖"}</div>
                  <p className="object-type">Object detected</p>
                  <h2 id="lesson-title">{current.name}</h2>
                  <p id="object-description">{current.description}</p>
                  <ul className="feature-list" aria-label="Observable features">{current.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </div>
                <fieldset className="choice-group">
                  <legend>How should the model label this object?</legend>
                  <button onClick={() => choose("ocean life")}><span aria-hidden="true">O</span><strong>Ocean life</strong><small>Keyboard shortcut: O</small></button>
                  <button onClick={() => choose("rubbish")}><span aria-hidden="true">R</span><strong>Rubbish</strong><small>Keyboard shortcut: R</small></button>
                </fieldset>
              </div>
            ) : !testing ? (
              <div className="complete-state">
                <div className="check" aria-hidden="true">✓</div>
                <p className="step-kicker">Training complete</p>
                <h2 id="lesson-title">The model has {labels.length} examples</h2>
                <p>Your labels became its training data. Now give it new objects and find out what patterns it learned.</p>
                <button className="primary-button" onClick={testModel}>Test my model <span aria-hidden="true">→</span></button>
              </div>
            ) : (
              <div className="results">
                <p className="step-kicker">Test results</p>
                <h2 id="lesson-title">Your model sorted {tested || "…"} of {testItems.length} objects correctly</h2>
                <p>Accuracy is not magic. It reflects the examples a model sees, the labels people choose, and patterns that may not work in every situation.</p>
                <div className="result-grid">
                  {testItems.map((item, i) => <div className="result-row" key={item.name}><span>{i + 1}</span><div><strong>{item.name}</strong><small>{item.description}</small></div><b>{i < tested ? "Correct" : tested ? "Mistake" : "Testing"}</b></div>)}
                </div>
                <div className="reflection"><strong>Think about it</strong><p>The shopping bag and moon jelly both drift. If a model focuses only on movement, what mistake might it make? This is why varied data and human review matter.</p></div>
                <div className="result-actions"><button className="primary-button" onClick={() => read("Key idea. Machine learning finds patterns in examples. Its decisions can be useful, but they are shaped by training data and human choices. We should test models with many different examples and check their mistakes.")}>Hear the key idea</button><button className="quiet-button" onClick={resetLesson}>Train again</button></div>
              </div>
            )}
          </article>
        </section>

        <section className="concepts" aria-labelledby="concept-title">
          <p className="step-kicker">What you’ll discover</p>
          <h2 id="concept-title">Three ideas beneath the surface</h2>
          <div className="concept-grid">
            <article><span>01</span><h3>Training data</h3><p>Models learn from labelled examples—not from rules they invent by themselves.</p><button onClick={() => read("Training data means examples given to a machine learning system so it can find patterns. The quality and variety of those examples matter.")}>Listen <span aria-hidden="true">▶</span></button></article>
            <article><span>02</span><h3>Patterns</h3><p>A model compares features such as shape, material, movement, or colour.</p><button onClick={() => read("Patterns are repeated features a model notices. A useful pattern can help with a new example, but a misleading pattern can cause a mistake.")}>Listen <span aria-hidden="true">▶</span></button></article>
            <article><span>03</span><h3>Bias &amp; care</h3><p>Missing or unbalanced examples can produce unfair or unreliable results.</p><button onClick={() => read("Bias can happen when training data leaves out important people, objects, or situations. People must test results, include diverse data, and remain responsible for decisions.")}>Listen <span aria-hidden="true">▶</span></button></article>
          </div>
        </section>
      </main>

      <div className="audio-status" role="status" aria-live="polite"><span aria-hidden="true">♪</span><span>{status}</span><button onClick={() => window.speechSynthesis?.cancel()}>Stop audio</button></div>
      <footer><span>Ocean Learner</span><p>Designed so sight is never required to learn.</p></footer>
    </div>
  );
}
