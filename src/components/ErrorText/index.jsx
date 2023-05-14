import P from 'prop-types';

export const ErrorText = ({ errorMessage }) => {
  return <h1>{errorMessage}</h1>;
};

ErrorText.propTypes = {
  errorMessage: P.string.isRequired,
};
