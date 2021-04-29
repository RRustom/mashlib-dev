const path = require('path')
const openpgp = require("openpgp");
const all = require('it-all')

// read public key
async function encrypt_file(ipfs_node, public_key, file_cid, output_dir_path) {

  const data = await all(ipfs_node.cat(file_cid))

  const files = await all(ipfs_node.get(file_cid))

  file_name = files[0].path // TODO: get just the name from the path 

  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(data),
    publicKeys: (await openpgp.key.readArmored(public_key)).keys,
  });

  //add file to IPFS node
  const { cid } = await node.add({
    path: path.join(output_dir_path, file_name),
    content: encrypted,
  })

  return cid
}
