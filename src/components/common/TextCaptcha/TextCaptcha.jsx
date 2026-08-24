import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import './TextCaptcha.css';

const TextCaptcha = forwardRef(function TextCaptcha({ fetchChallenge, answer, onAnswerChange }, ref) {
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');

  const refresh = useCallback(async () => {
    try {
      const res = await fetchChallenge();
      if (res.success) {
        setCode(res.code);
        setToken(res.token);
      }
    } catch (err) {
      console.warn('Could not load verification code:', err);
    }
    onAnswerChange('');
  }, [fetchChallenge, onAnswerChange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useImperativeHandle(ref, () => ({
    token,
    refresh,
  }), [token, refresh]);

  return (
    <div className="text-captcha-group">
      <div className="captcha-challenge-box">
        <div className="captcha-code-display">
          {code.split('').map((char, i) => (
            <span
              key={i}
              className="captcha-code-char"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}deg)` }}
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="captcha-refresh-btn"
          onClick={refresh}
          aria-label="Get a new code"
          title="Get a new code"
        >
          <FiRefreshCw />
        </button>
      </div>
      <input
        type="text"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Enter the code shown above"
        className="form-control-input"
        autoComplete="off"
        required
      />
    </div>
  );
});

export default TextCaptcha;
