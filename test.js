function hexStringToBytes(cipherText) {
            cipherText = String(cipherText);
            let str = cipherText.toLowerCase();
            let length = str.length;
            let bArr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length / 2);
            for (let i = 0, o = 0; i < length; i += 2, o++) {
                let a = str[i + 1],
                    b = str[i];
                if (b != "0") {
                    a = b + a;
                }
                let hexInt = java.lang.Integer.parseInt(new java.lang.String(a), 16);
                let inty = hexInt > 127 ? hexInt - 255 - 1 : hexInt;
                bArr[o] = inty;
            }
            return bArr;
        }

        function decryptData(cipherText) {
            let key = hexStringToBytes("C2A830A5E687678418F88F652984E925");
            log('key:' + key);
            let iv = hexStringToBytes("958DB2E92B361F373BFB35CCCC296FBB");
            let secretKeySpec = new SecretKeySpec(key, "AES");
            let ivParameterSpec = new IvParameterSpec(iv);
            let cipher = Cipher.getInstance("AES/CBC/PKCS7Padding");
            cipher.init(2, secretKeySpec, ivParameterSpec);
            return cipher.doFinal(cipherText);
        }
        const FileUtil = com.example.hikerview.utils.FileUtil;
        const Cipher = Cipher = javax.crypto.Cipher;
        const IvParameterSpec = javax.crypto.spec.IvParameterSpec;
        const SecretKeySpec = javax.crypto.spec.SecretKeySpec;

        $.exports.imageDecrypt = function() {
            let bytes = FileUtil.toBytes(input);
            bytes = decryptData(bytes);
            return FileUtil.toInputStream(bytes);
        }



        var imgfunc = $().image(() => $.require("req?rule=" + MY_TITLE).imageDecrypt());