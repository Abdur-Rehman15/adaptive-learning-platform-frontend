import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { downloadCertificate } from '../api/quizAttempt.api';

interface CertificateDownloadProps {
  courseId: number;
  courseTitle: string;
}

export const CertificateDownload = ({ courseId, courseTitle }: CertificateDownloadProps) => {
  const { token } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!token || isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      await downloadCertificate(token, courseId);
      setDownloadSuccess(true);
      // Reset success message after 4 seconds
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      setDownloadError((err as Error).message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="certificate-download">
      {/* Trophy icon & label */}
      <div className="certificate-download__header">
        <span className="certificate-download__trophy">🏆</span>
        <div>
          <p className="certificate-download__eyebrow">COURSE COMPLETE</p>
          <p className="certificate-download__title">Certificate of Completion</p>
          <p className="certificate-download__subtitle">{courseTitle}</p>
        </div>
      </div>

      {/* Download button */}
      <button
        id={`cert-download-btn-${courseId}`}
        type="button"
        className="dashboard-btn dashboard-btn--primary certificate-download__btn"
        onClick={() => void handleDownload()}
        disabled={isDownloading}
        aria-label={`Download certificate for ${courseTitle}`}
      >
        {isDownloading ? (
          <>
            <span className="quiz-view__spinner" />
            Generating PDF…
          </>
        ) : (
          <>⬇ Download Certificate</>
        )}
      </button>

      {/* Feedback messages */}
      {downloadSuccess && (
        <p className="certificate-download__success">
          ✓ Certificate saved to your downloads!
        </p>
      )}
      {downloadError && (
        <p className="certificate-download__error">{downloadError}</p>
      )}
    </div>
  );
};
