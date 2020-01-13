import i18n from "utils/i18n";

function Logo({ size }) {
  return (
    <>
      <img src="/cdn/002-bulldog.svg"></img>
      <style jsx>{`
        img {
          height: ${size};
        }
      `}</style>
    </>
  );
}

function NotAnsweredCount({ count }) {
  return (
    <div>
      {i18n("to_answer", count)}
      <style jsx>{`
        div {
          border-radius: 30px;
          background-color: #f2f2f2;
          padding: 0.4rem 0.8rem;
          width: fit-content;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}

export default function Header({ notAnsweredCount = 0 }) {
  return (
    <div>
      <Logo size="3rem" />
      <br />
      <NotAnsweredCount count={notAnsweredCount} />
      <style jsx>{`
        div {
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        br {
          height: 1rem;
        }
      `}</style>
    </div>
  );
}
