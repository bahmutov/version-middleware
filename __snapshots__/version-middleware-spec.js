exports['version-middleware using build.json loads extra stuff from build.json 1'] = {
  "version": "1.2.3",
  "git": "xxxxxxx",
  "id": "330556f921702ddf207f6e2fa932e3fe5d08fb38",
  "foo": "is extra data",
  "started": "xxxxxxxxxxxxxxxxxxxxxxxx"
}

exports['demo server returns version with no caching header 1'] = {
  "cache-control": "max-age=0, no-cache, no-store, no-transform, must-revalidate",
  "content-type": "application/json; charset=utf-8"
}

exports['demo server returns version with no caching header 2'] = {
  "version": "0.0.0-development",
  "git": "xxxxxxx",
  "started": "xxxxxxxxxxxxxxxxxxxxxxxx"
}

