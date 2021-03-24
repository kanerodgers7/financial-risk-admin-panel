// import download from 'downloadjs';

//
export const downloadAll = response => {
  console.log(response);
  // download(response.data, 'doc', response.headers['content-type']);
  //   console.log(response);
  //
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('download', 'doc');
  link.setAttribute('target', '__blank');
  link.style.display = 'none';

  document.body.appendChild(link);

  link.setAttribute('href', url);
  link.click();
  //
  //   // document.body.removeChild(link);
};
