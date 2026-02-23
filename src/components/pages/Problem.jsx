import React from 'react';
import { FaCogs, FaTractor, FaClock, FaChartLine } from 'react-icons/fa';
import SharedFooter from '../SharedFooter';
import './Problem.css';

function Problem({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="problem-page">
        <div className="problem-inner">
          <h1 className="problem-title anim-page-enter">Agriculture in Africa Is Fragmented</h1>
          <p className="problem-intro anim-page-enter anim-delay-1">
            Across the continent, agricultural systems face structural challenges that limit productivity and market access. 
            DigiLync addresses these gaps through coordinated infrastructure.
          </p>
          <div className="problem-grid">
            <div className="problem-card anim-page-enter anim-delay-2">
              <FaCogs className="problem-icon" />
              <h3>Under-Coordinated Mechanization</h3>
              <p>Mechanization exists but is under-coordinated across regions and seasons.</p>
            </div>
            <div className="problem-card anim-page-enter anim-delay-3">
              <FaTractor className="problem-icon" />
              <h3>Disconnected Providers</h3>
              <p>Service providers operate in isolation with no structured marketplace.</p>
            </div>
            <div className="problem-card anim-page-enter anim-delay-4">
              <FaClock className="problem-icon" />
              <h3>Timing & Availability Gaps</h3>
              <p>Farmers struggle with timing and availability of critical services.</p>
            </div>
            <div className="problem-card anim-page-enter anim-delay-5">
              <FaChartLine className="problem-icon" />
              <h3>Lack of Supply Visibility</h3>
              <p>Industrial buyers lack structured supply visibility and traceability.</p>
            </div>
          </div>
          <p className="problem-outro anim-page-enter anim-delay-6">
            By connecting farmers, providers, and buyers through structured scheduling and intelligent coordination, 
            we can unlock the full potential of Africa's agricultural sector.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Problem;
