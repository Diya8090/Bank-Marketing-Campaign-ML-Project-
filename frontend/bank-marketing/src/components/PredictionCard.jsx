import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Wallet, 
  User, 
  PhoneCall, 
  Home, 
  CreditCard, 
  RotateCcw, 
  Share2, 
  Zap, 
  ShieldCheck, 
  Award, 
  BarChart2,
  Loader2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Briefcase,
  GraduationCap,
  Heart,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { predictCustomer } from '../services/api';
import { 
  BENCHMARKS, 
  PRESET_PROFILES, 
  JOB_OPTIONS, 
  MARITAL_OPTIONS, 
  EDUCATION_OPTIONS, 
  CONTACT_OPTIONS, 
  MONTH_OPTIONS, 
  POUTCOME_OPTIONS 
} from '../utils/predictionModel';

export default function PredictionCard({ onSavePrediction }) {
  const topRef = useRef(null);

  const [formData, setFormData] = useState({
    age: 41,
    balance: 1362,
    duration: 258,
    campaign: 2,
    housing: 'no',
    loan: 'no',
    job: 'management',
    marital: 'married',
    education: 'tertiary',
    default: 'no',
    contact: 'cellular',
    day: 15,
    month: 'may',
    pdays: -1,
    previous: 0,
    poutcome: 'unknown'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('average_lead');

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch ML Prediction from Backend FastAPI API
  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    // Automatically scroll page up to prediction result card
    scrollToTop();

    try {
      const apiResult = await predictCustomer(formData);
      setPrediction(apiResult);
    } catch (err) {
      console.error("Prediction Error:", err);
      setErrorMsg("Unable to connect to prediction server (http://localhost:8000). Please make sure the FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await predictCustomer(formData);
        if (isMounted) {
          setPrediction(res);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg("Unable to connect to prediction server (http://localhost:8000). Please make sure the FastAPI backend is running.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => { isMounted = false; };
  }, []);

  // Trigger celebratory particle effect on predicted subscription
  useEffect(() => {
    if (prediction && prediction.prediction === 1 && prediction.subscription_probability_percent > 50) {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.7 }
      });
    }
  }, [prediction]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSelectedPresetId('');
  };

  const handleApplyPreset = (preset) => {
    setFormData(preset.data);
    setSelectedPresetId(preset.id);
    scrollToTop();
  };

  const handleReset = () => {
    const defaultData = PRESET_PROFILES[0].data;
    setFormData(defaultData);
    setSelectedPresetId('average_lead');
  };

  const handleSave = () => {
    if (!prediction) return;
    onSavePrediction({
      ...formData,
      ...prediction,
      timestamp: new Date().toISOString()
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleCopySummary = () => {
    if (!prediction) return;
    const summaryText = `--- DepositIQ AI Prediction Report ---
Decision: ${prediction.decision}
Subscription Probability: ${prediction.subscription_probability_percent}%
Not Subscribed Probability: ${prediction.not_subscription_probability_percent}%
Model: ${prediction.model} (16-Feature Scikit-Learn Pipeline)
ROC-AUC: ${prediction.roc_auc}% | Accuracy: ${prediction.accuracy}%
Inputs: Age ${formData.age}, Job ${formData.job}, Balance €${formData.balance}, Duration ${formData.duration}s, Contacts ${formData.campaign}, Previous Outcome ${formData.poutcome}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isSubscribed = prediction?.prediction === 1;
  const subProbPct = prediction?.subscription_probability_percent ?? 27.53;
  const notSubProbPct = prediction?.not_subscription_probability_percent ?? 72.47;
  const themeColor = isSubscribed ? 'var(--emerald-500)' : 'var(--rose-500)';
  const themeBgGradient = isSubscribed 
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.03) 100%)' 
    : 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(225, 29, 72, 0.03) 100%)';

  return (
    <div className="prediction-workspace" ref={topRef}>
      <div className="prediction-grid">
        {/* LEFT COLUMN: User Input Parameters Panel */}
        <div className="input-card-panel card-panel">
          <div className="panel-header">
            <div className="header-left">
              <div className="header-icon-box">
                <User size={20} />
              </div>
              <div>
                <h3>Customer Input Parameters</h3>
                <p className="subtitle">Enter customer parameters for real Scikit-Learn model prediction</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={handleReset} 
              title="Reset to Dataset Averages"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handlePredict} className="form-sections">
            {/* ======================================================== */}
            {/* SECTION 1: PRIMARY CORE FEATURES (Original Predictors)   */}
            {/* ======================================================== */}
            <div className="feature-section-header">
              <ShieldCheck size={16} className="text-indigo" />
              <span>1. Primary Predictive Features (Original Form Inputs)</span>
            </div>

            <div className="form-group-container">
              {/* Age Input */}
              <div className="input-field-box">
                <div className="field-header">
                  <label htmlFor="input-age">
                    <User size={15} className="field-icon" />
                    <span>Customer Age (Years)</span>
                  </label>
                  <div className="field-value-badge">
                    <span>{formData.age} yrs</span>
                  </div>
                </div>
                <input
                  id="input-age"
                  type="range"
                  min="18"
                  max="95"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-meta">
                  <span>18 yrs</span>
                  <span className="meta-highlight">Dataset Mean: {BENCHMARKS.age.mean} yrs</span>
                  <span>95 yrs</span>
                </div>
              </div>

              {/* Account Balance Input */}
              <div className="input-field-box">
                <div className="field-header">
                  <label htmlFor="input-balance">
                    <Wallet size={15} className="field-icon" />
                    <span>Average Yearly Balance (€ EUR)</span>
                  </label>
                  <div className="field-value-badge">
                    <span>€{Number(formData.balance).toLocaleString()}</span>
                  </div>
                </div>
                <input
                  id="input-balance"
                  type="range"
                  min="-1000"
                  max="20000"
                  step="100"
                  value={formData.balance}
                  onChange={(e) => handleInputChange('balance', Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-meta">
                  <span>-€1,000</span>
                  <span className="meta-highlight">Dataset Mean: €{BENCHMARKS.balance.mean}</span>
                  <span>€20,000</span>
                </div>
              </div>

              {/* Call Duration Input */}
              <div className="input-field-box duration-field-box">
                <div className="field-header">
                  <label htmlFor="input-duration">
                    <Clock size={15} className="field-icon" />
                    <span>Last Call Duration (Seconds)</span>
                  </label>
                  <div className="field-value-badge highlight-badge">
                    <span>{formData.duration}s ({formatDuration(formData.duration)})</span>
                  </div>
                </div>
                <input
                  id="input-duration"
                  type="range"
                  min="0"
                  max="1500"
                  step="5"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                  className="slider-input duration-slider"
                />
                <div className="slider-meta">
                  <span>0s</span>
                  <span className="meta-highlight">Dataset Mean: {BENCHMARKS.duration.mean}s (4.3 min)</span>
                  <span>1500s (25m)</span>
                </div>
              </div>

              {/* Campaign Contacts Input */}
              <div className="input-field-box">
                <div className="field-header">
                  <label htmlFor="input-campaign">
                    <PhoneCall size={15} className="field-icon" />
                    <span>Campaign Contacts Count</span>
                  </label>
                  <div className="field-value-badge">
                    <span>{formData.campaign} contact(s)</span>
                  </div>
                </div>
                <input
                  id="input-campaign"
                  type="range"
                  min="1"
                  max="15"
                  value={formData.campaign}
                  onChange={(e) => handleInputChange('campaign', Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-meta">
                  <span>1 contact</span>
                  <span className="meta-highlight">Dataset Mean: {BENCHMARKS.campaign.mean}</span>
                  <span>15 contacts</span>
                </div>
              </div>

              {/* Original Toggles: Housing Mortgage & Personal Debt */}
              <div className="toggles-grid">
                <div className="toggle-card">
                  <div className="toggle-card-label">
                    <Home size={16} />
                    <span>Housing Mortgage</span>
                  </div>
                  <div className="segmented-control">
                    <button
                      type="button"
                      className={formData.housing === 'no' ? 'selected green' : ''}
                      onClick={() => handleInputChange('housing', 'no')}
                    >
                      No Loan
                    </button>
                    <button
                      type="button"
                      className={formData.housing === 'yes' ? 'selected red' : ''}
                      onClick={() => handleInputChange('housing', 'yes')}
                    >
                      Has Loan
                    </button>
                  </div>
                </div>

                <div className="toggle-card">
                  <div className="toggle-card-label">
                    <CreditCard size={16} />
                    <span>Personal Debt</span>
                  </div>
                  <div className="segmented-control">
                    <button
                      type="button"
                      className={formData.loan === 'no' ? 'selected green' : ''}
                      onClick={() => handleInputChange('loan', 'no')}
                    >
                      No Debt
                    </button>
                    <button
                      type="button"
                      className={formData.loan === 'yes' ? 'selected red' : ''}
                      onClick={() => handleInputChange('loan', 'yes')}
                    >
                      Has Debt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 2: ADDITIONAL DATASET FEATURES (PLACED BELOW)    */}
            {/* ======================================================== */}
            <div className="feature-section-header context-section-header" style={{ marginTop: '1.5rem' }}>
              <Layers size={16} className="text-purple" />
              <span>2. Additional CRM & Campaign Dataset Features (Placed Below)</span>
            </div>

            <div className="form-group-container">
              {/* Job Occupation & Marital Status Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field-box">
                  <label htmlFor="input-job" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <Briefcase size={14} />
                    <span>Job Occupation</span>
                  </label>
                  <select
                    id="input-job"
                    value={formData.job}
                    onChange={(e) => handleInputChange('job', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                <div className="input-field-box">
                  <label htmlFor="input-marital" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <Heart size={14} />
                    <span>Marital Status</span>
                  </label>
                  <select
                    id="input-marital"
                    value={formData.marital}
                    onChange={(e) => handleInputChange('marital', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {MARITAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Education Level & Credit Default Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field-box">
                  <label htmlFor="input-education" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <GraduationCap size={14} />
                    <span>Education Level</span>
                  </label>
                  <select
                    id="input-education"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {EDUCATION_OPTIONS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                  </select>
                </div>

                <div className="input-field-box">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <CreditCard size={14} />
                    <span>Credit Default Status</span>
                  </label>
                  <div className="segmented-control">
                    <button type="button" className={formData.default === 'no' ? 'selected green' : ''} onClick={() => handleInputChange('default', 'no')}>No Default</button>
                    <button type="button" className={formData.default === 'yes' ? 'selected red' : ''} onClick={() => handleInputChange('default', 'yes')}>In Default</button>
                  </div>
                </div>
              </div>

              {/* Contact Channel & Contact Month Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field-box">
                  <label htmlFor="input-contact" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <PhoneCall size={14} />
                    <span>Contact Communication</span>
                  </label>
                  <select
                    id="input-contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {CONTACT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="input-field-box">
                  <label htmlFor="input-month" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <Calendar size={14} />
                    <span>Contact Month</span>
                  </label>
                  <select
                    id="input-month"
                    value={formData.month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              {/* Contact Day of Month & Previous Campaign Outcome Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field-box">
                  <div className="field-header">
                    <label htmlFor="input-day">
                      <Calendar size={14} />
                      <span>Day of Month (1-31)</span>
                    </label>
                    <div className="field-value-badge">
                      <span>Day {formData.day}</span>
                    </div>
                  </div>
                  <input
                    id="input-day"
                    type="range"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => handleInputChange('day', Number(e.target.value))}
                    className="slider-input"
                  />
                </div>

                <div className="input-field-box">
                  <label htmlFor="input-poutcome" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <TrendingUp size={14} />
                    <span>Previous Outcome</span>
                  </label>
                  <select
                    id="input-poutcome"
                    value={formData.poutcome}
                    onChange={(e) => handleInputChange('poutcome', e.target.value)}
                    style={{ width: '100%', padding: '0.68rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark-card-solid)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', fontWeight: 600 }}
                  >
                    {POUTCOME_OPTIONS.map(po => <option key={po} value={po}>{po}</option>)}
                  </select>
                </div>
              </div>

              {/* pdays & previous sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field-box">
                  <div className="field-header">
                    <label htmlFor="input-pdays" style={{ fontSize: '0.8rem' }}>
                      <span>Days Since Last Contact (pdays)</span>
                    </label>
                    <div className="field-value-badge">
                      <span>{formData.pdays} d</span>
                    </div>
                  </div>
                  <input
                    id="input-pdays"
                    type="range"
                    min="-1"
                    max="500"
                    value={formData.pdays}
                    onChange={(e) => handleInputChange('pdays', Number(e.target.value))}
                    className="slider-input"
                  />
                </div>

                <div className="input-field-box">
                  <div className="field-header">
                    <label htmlFor="input-previous" style={{ fontSize: '0.8rem' }}>
                      <span>Previous Contacts Count</span>
                    </label>
                    <div className="field-value-badge">
                      <span>{formData.previous}</span>
                    </div>
                  </div>
                  <input
                    id="input-previous"
                    type="range"
                    min="0"
                    max="20"
                    value={formData.previous}
                    onChange={(e) => handleInputChange('previous', Number(e.target.value))}
                    className="slider-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Predict Action Button */}
            <button 
              type="submit" 
              className="btn-primary-action submit-btn" 
              disabled={loading}
              style={{ marginTop: '1.2rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="icon-spin" />
                  <span>Evaluating 16-Feature Pipeline...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Predict Subscription Output</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Scikit-Learn Model Prediction Output */}
        <div className="output-card-wrapper">
          {errorMsg && (
            <div className="api-error-card card-panel">
              <AlertTriangle size={24} className="text-rose" />
              <div className="error-text-wrap">
                <h4>Prediction Backend Connection Error</h4>
                <p>{errorMsg}</p>
                <button type="button" className="btn-secondary-action btn-sm" onClick={handlePredict}>
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          <div 
            className={`prediction-creative-card ${isSubscribed ? 'card-positive' : 'card-negative'}`}
            style={{ background: themeBgGradient }}
          >
            {/* Top Model Badge */}
            <div className="card-top-bar">
              <div className="model-badge">
                <ShieldCheck size={16} />
                <span>{prediction ? prediction.model : '16-Feature Scikit-Learn Pipeline'}</span>
              </div>
              <div className="accuracy-pill">
                <Award size={14} />
                <span>{prediction ? prediction.roc_auc : 90.75}% ROC-AUC</span>
              </div>
            </div>

            {/* Radial Gauge SVG */}
            <div className="gauge-container">
              <svg className="radial-gauge-svg" viewBox="0 0 120 120">
                <circle className="gauge-bg" cx="60" cy="60" r="50" />
                <circle
                  className="gauge-progress"
                  cx="60"
                  cy="60"
                  r="50"
                  style={{
                    strokeDasharray: 314,
                    strokeDashoffset: 314 - (314 * Math.min(100, Math.max(0, subProbPct))) / 100,
                    stroke: themeColor
                  }}
                />
              </svg>
              <div className="gauge-center-content">
                {loading ? (
                  <Loader2 size={32} className="icon-spin text-indigo" />
                ) : (
                  <>
                    <span className="gauge-number" style={{ color: themeColor }}>
                      {subProbPct}%
                    </span>
                    <span className="gauge-label">Subscription Probability</span>
                  </>
                )}
              </div>
            </div>

            {/* Decision Outcome Banner */}
            <div className={`outcome-banner ${isSubscribed ? 'banner-subscribed' : 'banner-not-subscribed'}`}>
              <div className="outcome-icon-wrap">
                {isSubscribed ? (
                  <CheckCircle2 size={32} className="text-emerald" />
                ) : (
                  <XCircle size={32} className="text-rose" />
                )}
              </div>
              <div className="outcome-text-wrap">
                <span className="outcome-caption">ML PREDICTED DECISION</span>
                <h2 className="outcome-title">{prediction ? prediction.decision : 'CALCULATING...'}</h2>
              </div>
            </div>

            {/* Both Class Probabilities Breakdown */}
            <div className="probabilities-distribution-box card-panel">
              <div className="dist-title">
                <BarChart2 size={16} className="text-indigo" />
                <span>Class Probabilities (predict_proba)</span>
              </div>

              <div className="prob-row">
                <div className="prob-row-header">
                  <span className="prob-class-name text-emerald">SUBSCRIBED Probability</span>
                  <span className="prob-class-val text-emerald">{subProbPct}%</span>
                </div>
                <div className="prob-track">
                  <div 
                    className="prob-bar-fill fill-emerald" 
                    style={{ width: `${Math.min(100, Math.max(0, subProbPct))}%` }} 
                  />
                </div>
              </div>

              <div className="prob-row">
                <div className="prob-row-header">
                  <span className="prob-class-name text-rose">NOT SUBSCRIBED Probability</span>
                  <span className="prob-class-val text-rose">{notSubProbPct}%</span>
                </div>
                <div className="prob-track">
                  <div 
                    className="prob-bar-fill fill-rose" 
                    style={{ width: `${Math.min(100, Math.max(0, notSubProbPct))}%` }} 
                  />
                </div>
              </div>

              <div className="prob-sum-footer">
                <span>Sum of Probabilities: {(subProbPct + notSubProbPct).toFixed(2)}% (Strictly sums to 100%)</span>
              </div>
            </div>

            {/* Backend Feature Contribution Waterfall */}
            {prediction?.feature_contributions && prediction.feature_contributions.length > 0 && (
              <div className="feature-waterfall-box" style={{ background: 'var(--bg-dark-card-solid)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-dark)', marginBottom: '1rem' }}>
                <div className="waterfall-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.8rem' }}>
                  <BarChart2 size={16} className="text-indigo" />
                  <span>Active Feature Contributions (Log-Odds Impact)</span>
                </div>
                <div className="waterfall-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {prediction.feature_contributions.slice(0, 5).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: item.direction === 'positive' ? 'var(--emerald-500)' : 'var(--rose-500)'
                        }} />
                        <span style={{ fontWeight: 600 }}>{item.feature}</span>
                      </div>
                      <span style={{
                        fontWeight: 700,
                        color: item.direction === 'positive' ? 'var(--emerald-400)' : 'var(--rose-400)'
                      }}>
                        {item.log_odds_contribution > 0 ? `+${item.log_odds_contribution}` : item.log_odds_contribution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation Box */}
            <div className="recommendation-box">
              <div className="rec-header">
                <Sparkles size={16} className="text-amber" />
                <span>AI Strategy Recommendation</span>
              </div>
              <p className="rec-text">
                {formData.poutcome === 'success' 
                  ? "High probability prospect! Previous campaign was successful. Target with premium deposit terms."
                  : formData.duration < 180 
                  ? "Extend conversation duration beyond 3 minutes (180s). Call duration is the single strongest positive predictor in the model."
                  : formData.campaign > 3 
                  ? "Reduce follow-up frequency. High campaign contacts (>3) result in negative log-odds impact due to prospect fatigue."
                  : "Optimal prospect conditions! Balanced feature profile ready for conversion."}
              </p>
            </div>

            {/* Success Toast Banner when Saved */}
            {savedNotification && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--emerald-500)',
                  color: 'var(--emerald-400)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  marginBottom: '1rem',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <CheckCircle2 size={18} />
                <span>Prediction record successfully saved to history!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card-actions-row">
              <button
                type="button"
                className={`btn-primary-action ${savedNotification ? 'bg-emerald' : ''}`}
                disabled={!prediction}
                onClick={handleSave}
              >
                <Bookmark size={16} />
                <span>{savedNotification ? 'History Saved ✓' : 'Save to History'}</span>
              </button>

              <button
                type="button"
                className="btn-secondary-action"
                disabled={!prediction}
                onClick={handleCopySummary}
              >
                <Share2 size={16} />
                <span>{copiedNotification ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
