import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        AI-Powered <span className="text-blue-600">Audio-to-Score</span>
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
        Automatically transcribe your polyphonic audio tracks in MP3 and WAV formats into playable MIDI and MusicXML piano sheet music.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/dashboard"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/login" 
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
        >
          Log in <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}