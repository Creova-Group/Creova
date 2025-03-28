// frontend/utils/pinata.js
export const uploadFileToIPFS = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            const base64Content = reader.result.split(',')[1];

            try {
                const response = await fetch('/api/uploadToIPFS', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileContent: base64Content,
                        fileName: file.name,
                    }),
                });

                const textResponse = await response.text(); // Read response as text first
                console.log("Raw response from /api/uploadToIPFS:", textResponse);

                try {
                    const jsonResponse = JSON.parse(textResponse);
                    if (!response.ok) {
                        reject(new Error(`IPFS upload failed: ${jsonResponse.error}`));
                    }
                    resolve(jsonResponse.IpfsHash);
                } catch (error) {
                    reject(new Error(`Invalid JSON response from server: ${textResponse}`));
                }

                const result = await response.json();
                resolve(result.IpfsHash);
            } catch (error) {
                reject(error);
            }
        };

        reader.readAsDataURL(file);
    });
};