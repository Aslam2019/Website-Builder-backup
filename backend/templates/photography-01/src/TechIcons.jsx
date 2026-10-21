/**
 * ============================================================
 * ULTIMATE TECH SKILL LIBRARY — 400+ IT/Software Skills
 * Uses SimpleIcons CDN: https://cdn.simpleicons.org/{slug}/{color}
 * ============================================================
 */

const M = {}

function reg(slugs, slug, color, label) {
  slugs.forEach((s) => {
    M[s.toLowerCase()] = { slug, color, label }
  })
}

/* ============================================================
   PROGRAMMING LANGUAGES
   ============================================================ */
reg(['javascript', 'js'], 'javascript', 'F7DF1E', 'JS')
reg(['typescript', 'ts'], 'typescript', '3178C6', 'TS')
reg(['python', 'py', 'python3'], 'python', '3776AB', 'Py')
reg(['java'], 'openjdk', 'FFFFFF', 'Java')
reg(['c'], 'c', 'A8B9CC', 'C')
reg(['c++', 'cpp', 'cplusplus'], 'cplusplus', '00599C', 'C++')
reg(['c#', 'csharp', 'c sharp'], 'sharp', '512BD4', 'C#')
reg(['go', 'golang'], 'go', '00ADD8', 'Go')
reg(['rust', 'rustlang'], 'rust', 'FFFFFF', 'Rust')
reg(['ruby'], 'ruby', 'CC342D', 'Ruby')
reg(['php'], 'php', '777BB4', 'PHP')
reg(['swift'], 'swift', 'FA7343', 'Swift')
reg(['kotlin'], 'kotlin', '7F52FF', 'KT')
reg(['dart'], 'dart', '0175C2', 'Dart')
reg(['scala'], 'scala', 'DC322F', 'Scala')
reg(['r', 'r language'], 'r', '276DC3', 'R')
reg(['perl'], 'perl', '39457E', 'Perl')
reg(['lua'], 'lua', '2C2D72', 'Lua')
reg(['haskell'], 'haskell', '5D4F85', 'HS')
reg(['elixir'], 'elixir', '4B275F', 'Elixir')
reg(['erlang'], 'erlang', 'A90533', 'Erlang')
reg(['clojure'], 'clojure', '5881D8', 'CLJ')
reg(['f#', 'fsharp'], 'fsharp', '378BBA', 'F#')
reg(['visual basic', 'vba'], 'visualbasic', '512BD4', 'VB')
reg(['solidity'], 'solidity', '363636', 'SOL')
reg(['cobol'], 'cobol', '1F3B5B', 'COBOL')
reg(['fortran'], 'fortran', '734F96', 'FTN')
reg(['assembly', 'asm'], 'assemblyscript', '007AAC', 'ASM')
reg(['objective-c', 'objc'], 'apple', 'FFFFFF', 'ObjC')
reg(['groovy'], 'apachegroovy', '4298B8', 'GRV')
reg(['julia'], 'julia', '9558B2', 'Julia')
reg(['nim'], 'nim', 'FFE953', 'Nim')
reg(['zig'], 'zig', 'F7A41D', 'Zig')
reg(['crystal'], 'crystal', 'FFFFFF', 'Crystal')
reg(['bash'], 'gnubash', '4EAA25', 'Bash')
reg(['shell', 'sh'], 'gnubash', '4EAA25', 'SH')
reg(['powershell', 'ps1'], 'powershell', '5391FE', 'PS')
reg(['zsh'], 'gnubash', '4EAA25', 'Zsh')
reg(['sql'], 'mysql', '4479A1', 'SQL')
reg(['plsql'], 'oracle', 'F80000', 'PLSQL')
reg(['tsql'], 'microsoftsqlserver', 'CC2927', 'TSQL')

/* ============================================================
   FRONTEND
   ============================================================ */
reg(['react', 'reactjs', 'react.js', 'react js'], 'react', '61DAFB', 'React')
reg(['react native', 'reactnative'], 'react', '61DAFB', 'RN')
reg(['nextjs', 'next.js', 'next'], 'nextdotjs', 'FFFFFF', 'Next')
reg(['vue', 'vuejs', 'vue.js'], 'vuedotjs', '4FC08D', 'Vue')
reg(['nuxt', 'nuxtjs', 'nuxt.js'], 'nuxtdotjs', '00DC82', 'Nuxt')
reg(['angular', 'angularjs'], 'angular', 'DD0031', 'NG')
reg(['svelte', 'sveltekit'], 'svelte', 'FF3E00', 'Svelte')
reg(['solidjs', 'solid'], 'solid', '2C4F7C', 'Solid')
reg(['astro'], 'astro', 'BC52EE', 'Astro')
reg(['remix'], 'remix', '000000', 'Remix')
reg(['ember', 'emberjs'], 'emberdotjs', 'E04E39', 'Ember')
reg(['jquery'], 'jquery', '0769AD', 'jQ')
reg(['preact'], 'preact', '673AB8', 'Preact')
reg(['lit'], 'lit', '324FFF', 'Lit')
reg(['alpinejs', 'alpine'], 'alpinedotjs', '8BC0D0', 'Alpine')
reg(['htmx'], 'htmx', '3366CC', 'HTMX')

/* ---------- CSS ---------- */
reg(['html', 'html5'], 'html5', 'E34F26', 'HTML')
reg(['css', 'css3'], 'css3', '1572B6', 'CSS')
reg(['tailwind', 'tailwindcss', 'tailwind css'], 'tailwindcss', '06B6D4', 'TW')
reg(['bootstrap'], 'bootstrap', '7952B3', 'BS')
reg(['material ui', 'mui', 'material-ui'], 'mui', '007FFF', 'MUI')
reg(['chakra ui', 'chakra'], 'chakraui', '319795', 'Chakra')
reg(['ant design', 'antd'], 'antdesign', '0170FE', 'AntD')
reg(['sass', 'scss'], 'sass', 'CC6699', 'Sass')
reg(['less'], 'less', '1D365D', 'Less')
reg(['stylus'], 'stylus', '333333', 'Stylus')
reg(['postcss'], 'postcss', 'DD3A0A', 'PCSS')
reg(['emotion'], 'emotion', 'D26AC2', 'Emotion')
reg(['styled components', 'styled-components'], 'styledcomponents', 'DB7093', 'SC')

/* ---------- Build Tools ---------- */
reg(['webpack'], 'webpack', '8DD6F9', 'WP')
reg(['vite'], 'vite', '646CFF', 'Vite')
reg(['rollup'], 'rollupdotjs', 'EC4A3F', 'Rollup')
reg(['parcel'], 'parcel', 'E7C05D', 'Parcel')
reg(['esbuild'], 'esbuild', 'FFCF00', 'ESB')
reg(['babel'], 'babel', 'F9DC3E', 'Babel')
reg(['swc'], 'swc', 'FFFFFF', 'SWC')
reg(['turbopack', 'turborepo'], 'turborepo', 'EF4444', 'Turbo')
reg(['nx'], 'nx', '143055', 'NX')

/* ============================================================
   BACKEND
   ============================================================ */
reg(['node', 'nodejs', 'node.js'], 'nodedotjs', '5FA04E', 'Node')
reg(['express', 'expressjs', 'express.js'], 'express', 'FFFFFF', 'Express')
reg(['nestjs', 'nest.js', 'nest'], 'nestjs', 'E0234E', 'Nest')
reg(['fastify'], 'fastify', 'FFFFFF', 'Fastify')
reg(['koa'], 'koa', '33333D', 'Koa')
reg(['hapi'], 'hapi', 'FF6F00', 'Hapi')
reg(['adonis', 'adonisjs'], 'adonisjs', '5A45FF', 'Adonis')
reg(['django'], 'django', '44B78B', 'Django')
reg(['flask'], 'flask', 'FFFFFF', 'Flask')
reg(['fastapi'], 'fastapi', '009688', 'FastAPI')
reg(['tornado'], 'tornado', '5A88B8', 'Tornado')
reg(['sanic'], 'sanic', 'FF0D68', 'Sanic')
reg(['spring', 'spring boot', 'springboot'], 'springboot', '6DB33F', 'Spring')
reg(['micronaut'], 'micronaut', 'FFFFFF', 'MNT')
reg(['quarkus'], 'quarkus', '4695EB', 'Quarkus')
reg(['laravel'], 'laravel', 'FF2D20', 'Laravel')
reg(['symfony'], 'symfony', 'FFFFFF', 'SF')
reg(['codeigniter'], 'codeigniter', 'EF4223', 'CI')
reg(['cakephp'], 'cakephp', 'D33C43', 'Cake')
reg(['rails', 'ruby on rails', 'ror'], 'rubyonrails', 'CC0000', 'Rails')
reg(['sinatra'], 'rubysinatra', '000000', 'Sinatra')
reg(['phoenix'], 'phoenixframework', 'FD4F00', 'Phoenix')
reg(['aspnet', 'asp.net', 'asp.net core'], 'dotnet', '512BD4', '.NET')
reg(['dotnet', '.net'], 'dotnet', '512BD4', '.NET')
reg(['gin', 'gin gonic'], 'gin', '008ECF', 'Gin')
reg(['fiber'], 'fiber', '00ACD7', 'Fiber')
reg(['echo'], 'echo', '00ACD7', 'Echo')
reg(['actix'], 'actix', '000000', 'Actix')
reg(['rocket'], 'rocket', 'D33847', 'Rocket')

/* ============================================================
   DATABASES
   ============================================================ */
reg(['mongodb', 'mongo'], 'mongodb', '47A248', 'MongoDB')
reg(['mysql'], 'mysql', '4479A1', 'MySQL')
reg(['mariadb'], 'mariadb', '003545', 'MariaDB')
reg(['postgresql', 'postgres', 'pg'], 'postgresql', '4169E1', 'PG')
reg(['sqlite'], 'sqlite', '003B57', 'SQLite')
reg(['oracle', 'oracle db'], 'oracle', 'F80000', 'Oracle')
reg(['microsoft sql server', 'mssql', 'sql server'], 'microsoftsqlserver', 'CC2927', 'MSSQL')
reg(['redis'], 'redis', 'FF4438', 'Redis')
reg(['memcached'], 'memcached', '2D6E5E', 'MC')
reg(['cassandra', 'apache cassandra'], 'apachecassandra', '1287B1', 'C*')
reg(['couchdb', 'apache couchdb'], 'apachecouchdb', 'E42528', 'Couch')
reg(['couchbase'], 'couchbase', 'EA2328', 'CB')
reg(['neo4j'], 'neo4j', '4581C3', 'Neo4j')
reg(['dynamodb'], 'amazondynamodb', '4053D6', 'DDB')
reg(['firebase'], 'firebase', 'FFCA28', 'FB')
reg(['firestore'], 'firebase', 'FFCA28', 'FS')
reg(['supabase'], 'supabase', '3ECF8E', 'SB')
reg(['elasticsearch', 'elastic'], 'elasticsearch', '005571', 'ES')
reg(['opensearch'], 'opensearch', '005EB8', 'OS')
reg(['clickhouse'], 'clickhouse', 'FFCC01', 'CH')
reg(['snowflake'], 'snowflake', '29B5E8', 'Snow')
reg(['bigquery', 'big query'], 'googlebigquery', '669DF6', 'BQ')
reg(['redshift'], 'amazonredshift', '8C4FFF', 'RS')
reg(['influxdb'], 'influxdb', '22ADF6', 'Influx')
reg(['prometheus'], 'prometheus', 'E6522C', 'Prom')
reg(['grafana'], 'grafana', 'F46800', 'Graf')
reg(['arangodb'], 'arangodb', 'DDD9D9', 'Arango')
reg(['faunadb'], 'faunadb', '3A4A60', 'Fauna')
reg(['prisma', 'prisma orm'], 'prisma', '2D3748', 'Prisma')
reg(['sequelize'], 'sequelize', '52B0E7', 'Seq')
reg(['mongoose'], 'mongoose', '880000', 'Mongoose')
reg(['typeorm'], 'typeorm', 'FE0902', 'TypeORM')
reg(['hibernate'], 'hibernate', '59666C', 'Hib')

/* ============================================================
   AWS
   ============================================================ */
reg(['aws', 'amazon web services'], 'amazonwebservices', 'FF9900', 'AWS')
reg(['amazon ec2', 'ec2', 'aws ec2'], 'amazonec2', 'FF9900', 'EC2')
reg(['amazon s3', 's3', 'aws s3', 'simple storage'], 'amazons3', '569A31', 'S3')
reg(['amazon rds', 'rds', 'aws rds'], 'amazonrds', '527FFF', 'RDS')
reg(['amazon vpc', 'vpc', 'aws vpc'], 'amazonwebservices', 'FF9900', 'VPC')
reg(['amazon route 53', 'route 53', 'route53', 'aws route 53'], 'amazonroute53', '8C4FFF', 'R53')
reg(['amazon cloudwatch', 'cloudwatch'], 'amazoncloudwatch', 'FF4F8B', 'CW')
reg(['aws lambda', 'lambda', 'amazon lambda'], 'awslambda', 'FF9900', 'λ')
reg(['aws iam', 'iam'], 'amazonwebservices', 'FF9900', 'IAM')
reg(['aws ecs', 'ecs'], 'amazonecs', 'FF9900', 'ECS')
reg(['aws eks', 'eks'], 'amazoneks', 'FF9900', 'EKS')
reg(['aws fargate'], 'awsfargate', 'FF9900', 'FG')
reg(['aws cloudfront', 'cloudfront'], 'amazoncloudfront', '8C4FFF', 'CF')
reg(['aws amplify'], 'awsamplify', 'FF9900', 'Amp')
reg(['aws cognito'], 'amazoncognito', 'FF9900', 'COG')
reg(['aws sqs', 'sqs'], 'amazonsqs', 'FF4F8B', 'SQS')
reg(['aws sns', 'sns'], 'amazonsns', 'FF4F8B', 'SNS')
reg(['aws kinesis'], 'amazonkinesis', '8C4FFF', 'KIN')
reg(['aws glue'], 'awsglue', '8C4FFF', 'Glue')
reg(['aws athena'], 'amazonathena', '8C4FFF', 'ATH')
reg(['aws emr'], 'amazonemr', '8C4FFF', 'EMR')
reg(['aws sagemaker', 'sagemaker'], 'amazonsagemaker', 'FF9900', 'SM')
reg(['aws bedrock'], 'amazonbedrock', 'FF9900', 'BR')
reg(['aws lightsail'], 'amazonlightsail', 'FF9900', 'LS')

/* ============================================================
   OTHER CLOUD
   ============================================================ */
reg(['azure', 'microsoft azure'], 'microsoftazure', '0078D4', 'Azure')
reg(['azure devops'], 'azuredevops', '0078D4', 'AzDO')
reg(['azure functions'], 'azurefunctions', '0062AD', 'AzFn')
reg(['gcp', 'google cloud', 'google cloud platform'], 'googlecloud', '4285F4', 'GCP')
reg(['google cloud run', 'cloud run'], 'googlecloudrun', '4285F4', 'CRun')
reg(['google cloud functions'], 'googlecloudfunctions', '4285F4', 'GCF')
reg(['digitalocean'], 'digitalocean', '0080FF', 'DO')
reg(['linode'], 'linode', '00A95C', 'Linode')
reg(['heroku'], 'heroku', '430098', 'Heroku')
reg(['vercel'], 'vercel', 'FFFFFF', 'Vercel')
reg(['netlify'], 'netlify', '00C7B7', 'Netlify')
reg(['cloudflare'], 'cloudflare', 'F38020', 'CF')
reg(['render'], 'render', '000000', 'Render')
reg(['railway'], 'railway', '0B0D0E', 'RW')
reg(['fly.io', 'flyio'], 'flydotio', '24175B', 'Fly')
reg(['ibm cloud'], 'ibmcloud', '052FAD', 'IBM')

/* ============================================================
   DEVOPS
   ============================================================ */
reg(['docker'], 'docker', '2496ED', 'Docker')
reg(['docker compose', 'docker-compose'], 'docker', '2496ED', 'Compose')
reg(['kubernetes', 'k8s'], 'kubernetes', '326CE5', 'K8s')
reg(['helm'], 'helm', '0F1689', 'Helm')
reg(['istio'], 'istio', '466BB0', 'Istio')
reg(['consul'], 'consul', 'F24C53', 'Consul')
reg(['vault'], 'vault', 'FFEC6E', 'Vault')
reg(['terraform'], 'terraform', '7B42BC', 'TF')
reg(['pulumi'], 'pulumi', '8A3391', 'Pulumi')
reg(['ansible'], 'ansible', 'EE0000', 'Ansible')
reg(['chef'], 'chef', 'F09820', 'Chef')
reg(['puppet'], 'puppet', 'FFAE1A', 'Puppet')
reg(['jenkins'], 'jenkins', 'D24939', 'Jenkins')
reg(['gitlab ci', 'gitlab-ci'], 'gitlab', 'FC6D26', 'GLCI')
reg(['github actions', 'gha'], 'githubactions', '2088FF', 'GHA')
reg(['circleci', 'circle ci'], 'circleci', '343434', 'CCI')
reg(['travis ci', 'travisci'], 'travisci', '3EAAAF', 'Travis')
reg(['argo cd', 'argocd', 'argo'], 'argo', 'EF7B4D', 'Argo')
reg(['nginx'], 'nginx', '009639', 'Nginx')
reg(['apache'], 'apache', 'D22128', 'Apache')
reg(['tomcat'], 'apachetomcat', 'F8DC75', 'Tomcat')
reg(['caddy'], 'caddy', '1F88C0', 'Caddy')
reg(['haproxy'], 'haproxy', '106DA9', 'HA')
reg(['traefik'], 'traefikproxy', '24A1C1', 'Traefik')
reg(['envoy'], 'envoyproxy', 'AC6199', 'Envoy')

/* ============================================================
   VERSION CONTROL
   ============================================================ */
reg(['git'], 'git', 'F05032', 'Git')
reg(['github'], 'github', 'FFFFFF', 'GitHub')
reg(['git & github'], 'github', 'FFFFFF', 'GitHub')
reg(['git and github'], 'github', 'FFFFFF', 'GitHub')
reg(['gitlab'], 'gitlab', 'FC6D26', 'GitLab')
reg(['bitbucket'], 'bitbucket', '0052CC', 'Bitbucket')
reg(['svn', 'subversion'], 'subversion', '809CC9', 'SVN')
reg(['mercurial'], 'mercurial', '999999', 'Hg')

/* ============================================================
   OS
   ============================================================ */
reg(['linux'], 'linux', 'FCC624', 'Linux')
reg(['ubuntu'], 'ubuntu', 'E95420', 'Ubuntu')
reg(['debian'], 'debian', 'A81D33', 'Debian')
reg(['centos'], 'centos', '262577', 'CentOS')
reg(['fedora'], 'fedora', '51A2DA', 'Fedora')
reg(['redhat', 'rhel', 'red hat'], 'redhat', 'EE0000', 'RHEL')
reg(['alpine'], 'alpinelinux', '0D597F', 'Alpine')
reg(['arch linux', 'arch'], 'archlinux', '1793D1', 'Arch')
reg(['suse'], 'suse', '0C322C', 'SUSE')
reg(['kali linux', 'kali'], 'kalilinux', '557C94', 'Kali')
reg(['windows'], 'windows', '0078D6', 'Win')
reg(['macos', 'mac', 'osx'], 'apple', 'FFFFFF', 'Mac')
reg(['android'], 'android', '34A853', 'Android')
reg(['ios'], 'apple', 'FFFFFF', 'iOS')
reg(['raspberry pi', 'raspi'], 'raspberrypi', 'A22846', 'Pi')

/* ============================================================
   MOBILE
   ============================================================ */
reg(['flutter'], 'flutter', '02569B', 'Flutter')
reg(['ionic'], 'ionic', '3880FF', 'Ionic')
reg(['cordova', 'phonegap'], 'apachecordova', 'E8E8E8', 'Cordova')
reg(['capacitor'], 'capacitor', '119EFF', 'Cap')
reg(['xamarin'], 'xamarin', '3498DB', 'Xam')
reg(['jetpack compose'], 'jetpackcompose', '4285F4', 'JPC')

/* ============================================================
   AI / ML
   ============================================================ */
reg(['tensorflow', 'tf'], 'tensorflow', 'FF6F00', 'TF')
reg(['pytorch'], 'pytorch', 'EE4C2C', 'PT')
reg(['keras'], 'keras', 'D00000', 'Keras')
reg(['scikit learn', 'scikit-learn', 'sklearn'], 'scikitlearn', 'F7931E', 'SKL')
reg(['pandas'], 'pandas', '150458', 'PD')
reg(['numpy'], 'numpy', '013243', 'NP')
reg(['scipy'], 'scipy', '8CAAE6', 'SP')
reg(['matplotlib'], 'matplotlib', '11557C', 'MPL')
reg(['seaborn'], 'python', '3776AB', 'SBN')
reg(['opencv'], 'opencv', '5C3EE8', 'CV')
reg(['spacy'], 'spacy', '09A3D5', 'Spacy')
reg(['hugging face', 'huggingface', 'hf'], 'huggingface', 'FFD21E', 'HF')
reg(['transformers'], 'huggingface', 'FFD21E', 'Trans')
reg(['langchain'], 'langchain', '1C3C3C', 'LC')
reg(['openai', 'gpt', 'chatgpt'], 'openai', 'FFFFFF', 'GPT')
reg(['anthropic', 'claude'], 'anthropic', '191919', 'Claude')
reg(['ollama'], 'ollama', 'FFFFFF', 'Ollama')
reg(['jax'], 'jax', 'FFFFFF', 'JAX')
reg(['xgboost'], 'xgboost', '189FDD', 'XGB')
reg(['lightgbm'], 'lightgbm', '2980B9', 'LGB')
reg(['catboost'], 'catboost', 'FFCC00', 'CatB')
reg(['mlflow'], 'mlflow', '0194E2', 'MLF')
reg(['apache spark', 'spark', 'pyspark'], 'apachespark', 'E25A1C', 'Spark')
reg(['apache hadoop', 'hadoop'], 'apachehadoop', '66CCFF', 'Hadoop')
reg(['apache kafka', 'kafka'], 'apachekafka', 'FFFFFF', 'Kafka')
reg(['apache airflow', 'airflow'], 'apacheairflow', '017CEE', 'AF')
reg(['apache flink', 'flink'], 'apacheflink', 'E6526F', 'Flink')
reg(['apache beam'], 'apachebeam', 'FFAB00', 'Beam')
reg(['apache hive'], 'apachehive', 'FDEE21', 'Hive')
reg(['apache nifi'], 'apachenifi', '728E9B', 'NiFi')
reg(['dbt'], 'dbt', 'FF694B', 'dbt')
reg(['databricks'], 'databricks', 'FF3621', 'DB')

/* ============================================================
   MESSAGE QUEUES
   ============================================================ */
reg(['rabbitmq'], 'rabbitmq', 'FF6600', 'RMQ')
reg(['nats'], 'natsdotio', '27AAE1', 'NATS')
reg(['zeromq', 'zmq'], 'zeromq', 'DF0000', 'ZMQ')
reg(['mqtt'], 'mqtt', '660066', 'MQTT')
reg(['apache pulsar', 'pulsar'], 'apachepulsar', '188FFF', 'Pulsar')

/* ============================================================
   TESTING
   ============================================================ */
reg(['jest'], 'jest', 'C21325', 'Jest')
reg(['vitest'], 'vitest', '6DA544', 'Vitest')
reg(['mocha'], 'mocha', '8D6748', 'Mocha')
reg(['jasmine'], 'jasmine', '8A4182', 'Jasmine')
reg(['cypress'], 'cypress', '17202C', 'Cypress')
reg(['playwright'], 'playwright', '2EAD33', 'PW')
reg(['puppeteer'], 'puppeteer', '40B5A4', 'Pptr')
reg(['selenium'], 'selenium', '43B02A', 'Se')
reg(['appium'], 'appium', 'EE376D', 'Appium')
reg(['karma'], 'karma', 'B76E79', 'Karma')
reg(['pytest'], 'pytest', '0A9EDC', 'pytest')
reg(['junit'], 'junit5', '25A162', 'JUnit')
reg(['testng'], 'testng', 'ED8B00', 'TestNG')
reg(['rspec'], 'ruby', 'CC342D', 'RSpec')
reg(['phpunit'], 'phpunit', '4F5B93', 'PHPUnit')
reg(['postman'], 'postman', 'FF6C37', 'PM')
reg(['insomnia'], 'insomnia', '4000BF', 'Insomnia')

/* ============================================================
   MONITORING
   ============================================================ */
reg(['datadog'], 'datadog', '632CA6', 'DD')
reg(['new relic', 'newrelic'], 'newrelic', '1CE783', 'NR')
reg(['sentry'], 'sentry', '362D59', 'Sentry')
reg(['kibana'], 'kibana', '005571', 'Kib')
reg(['logstash'], 'logstash', '005571', 'LS')
reg(['elk stack', 'elk'], 'elasticstack', '005571', 'ELK')
reg(['splunk'], 'splunk', '000000', 'Splunk')
reg(['jaeger'], 'jaegertracing', '66CFE3', 'Jaeger')

/* ============================================================
   AUTH / SECURITY
   ============================================================ */
reg(['oauth', 'oauth2'], 'oauth', 'FFFFFF', 'OAuth')
reg(['jwt', 'json web token'], 'jsonwebtokens', 'FFFFFF', 'JWT')
reg(['okta'], 'okta', '007DC1', 'Okta')
reg(['auth0'], 'auth0', 'EB5424', 'Auth0')
reg(['keycloak'], 'keycloak', '4D4D4D', 'KC')
reg(['letsencrypt', 'lets encrypt', 'ssl', 'tls'], 'letsencrypt', '003A70', 'LE')
reg(['owasp'], 'owasp', '000000', 'OWASP')
reg(['wireshark'], 'wireshark', '1679A7', 'WS')
reg(['nmap'], 'nmap', '4682B4', 'Nmap')
reg(['metasploit'], 'metasploit', '2596CD', 'MSF')
reg(['burp suite', 'burpsuite'], 'burpsuite', 'FF6633', 'Burp')

/* ============================================================
   DESIGN
   ============================================================ */
reg(['figma'], 'figma', 'F24E1E', 'Figma')
reg(['sketch'], 'sketch', 'F7B500', 'Sketch')
reg(['adobe xd', 'xd'], 'adobexd', 'FF61F6', 'XD')
reg(['photoshop', 'ps'], 'adobephotoshop', '31A8FF', 'PS')
reg(['illustrator', 'ai'], 'adobeillustrator', 'FF9A00', 'AI')
reg(['after effects', 'ae'], 'adobeaftereffects', '9999FF', 'AE')
reg(['premiere pro', 'premiere'], 'adobepremierepro', '9999FF', 'Pr')
reg(['lightroom'], 'adobelightroom', '31A8FF', 'LR')
reg(['canva'], 'canva', '00C4CC', 'Canva')
reg(['invision'], 'invision', 'FF3366', 'Inv')
reg(['framer'], 'framer', '0055FF', 'Framer')
reg(['zeplin'], 'zeplin', 'FDBD39', 'Zeplin')
reg(['blender'], 'blender', 'F5792A', 'Blend')
reg(['cinema 4d', 'c4d'], 'cinema4d', '011A6A', 'C4D')
reg(['maya'], 'autodeskmaya', '37A5CC', 'Maya')
reg(['3ds max', '3dsmax'], 'autodesk', '0696D7', '3DS')

/* ============================================================
   CMS / ECOMMERCE
   ============================================================ */
reg(['wordpress'], 'wordpress', '21759B', 'WP')
reg(['drupal'], 'drupal', '0678BE', 'Drupal')
reg(['joomla'], 'joomla', '5091CD', 'Joomla')
reg(['ghost'], 'ghost', '15171A', 'Ghost')
reg(['strapi'], 'strapi', '4945FF', 'Strapi')
reg(['contentful'], 'contentful', '2478CC', 'CF')
reg(['sanity'], 'sanity', 'F03E2F', 'Sanity')
reg(['shopify'], 'shopify', '7AB55C', 'SH')
reg(['woocommerce'], 'woocommerce', '96588A', 'Woo')
reg(['magento'], 'magento', 'EE672F', 'Mag')
reg(['prestashop'], 'prestashop', 'DF0067', 'PS')
reg(['bigcommerce'], 'bigcommerce', '121118', 'BC')

/* ============================================================
   PRODUCTIVITY
   ============================================================ */
reg(['slack'], 'slack', '4A154B', 'Slack')
reg(['notion'], 'notion', 'FFFFFF', 'Notion')
reg(['jira'], 'jira', '0052CC', 'Jira')
reg(['confluence'], 'confluence', '172B4D', 'Confl')
reg(['trello'], 'trello', '0052CC', 'Trello')
reg(['asana'], 'asana', 'F06A6A', 'Asana')
reg(['monday.com', 'monday'], 'mondaydotcom', 'FF3D57', 'Mon')
reg(['clickup'], 'clickup', '7B68EE', 'CU')
reg(['linear'], 'linear', '5E6AD2', 'Linear')
reg(['miro'], 'miro', '050038', 'Miro')
reg(['loom'], 'loom', '625DF5', 'Loom')
reg(['zoom'], 'zoom', '0B5CFF', 'Zoom')
reg(['teams', 'microsoft teams'], 'microsoftteams', '6264A7', 'Teams')
reg(['discord'], 'discord', '5865F2', 'Discord')

/* ============================================================
   IDEs
   ============================================================ */
reg(['vs code', 'vscode', 'visual studio code'], 'visualstudiocode', '007ACC', 'VSC')
reg(['visual studio'], 'visualstudio', '5C2D91', 'VS')
reg(['intellij', 'intellij idea'], 'intellijidea', '000000', 'IJ')
reg(['pycharm'], 'pycharm', '21D789', 'PC')
reg(['webstorm'], 'webstorm', '07C3F2', 'WS')
reg(['phpstorm'], 'phpstorm', 'B45BEC', 'PHPS')
reg(['android studio'], 'androidstudio', '3DDC84', 'AS')
reg(['xcode'], 'xcode', '147EFB', 'Xcode')
reg(['eclipse'], 'eclipseide', '2C2255', 'Ecl')
reg(['netbeans'], 'apachenetbeanside', '1B6CA8', 'NB')
reg(['sublime text', 'sublime'], 'sublimetext', 'FF9800', 'Subl')
reg(['vim'], 'vim', '019733', 'Vim')
reg(['neovim'], 'neovim', '57A143', 'Nvim')
reg(['emacs'], 'gnuemacs', '7F5AB6', 'Emacs')
reg(['jupyter'], 'jupyter', 'F37626', 'Jup')
reg(['rstudio'], 'rstudio', '75AADB', 'RStu')
reg(['anaconda'], 'anaconda', '44A833', 'Conda')

/* ============================================================
   API / PROTOCOLS
   ============================================================ */
reg(['graphql'], 'graphql', 'E10098', 'GQL')
reg(['apollo'], 'apollographql', '311C87', 'Apollo')
reg(['grpc'], null, '244C5A', 'gRPC')
reg(['websocket', 'websockets', 'ws'], null, '010101', 'WS')
reg(['socket.io', 'socketio'], 'socketdotio', 'FFFFFF', 'SIO')
reg(['rest', 'rest api', 'restful'], null, '6366F1', 'REST')
reg(['microservices'], null, '6366F1', 'µS')
reg(['serverless'], null, 'FD5750', 'SLS')
reg(['soap'], null, '6366F1', 'SOAP')
reg(['saml'], null, '6366F1', 'SAML')
reg(['openid'], 'openid', 'F78C40', 'OIDC')
reg(['webhook', 'webhooks'], null, '6366F1', 'Hook')
reg(['json'], 'json', 'FFFFFF', 'JSON')
reg(['xml'], 'w3c', '005A9C', 'XML')
reg(['yaml'], 'yaml', 'CB171E', 'YAML')
reg(['protobuf', 'protocol buffers'], 'protobuf', '4285F4', 'PB')

/* ============================================================
   NETWORKING
   ============================================================ */
reg(['networking'], 'cisco', '1BA0D7', 'NET')
reg(['dns'], 'cloudflare', 'F38020', 'DNS')
reg(['vpn'], null, '6366F1', 'VPN')
reg(['subnet', 'subnets'], null, 'FF9900', 'SUB')
reg(['route table', 'route tables'], null, 'FF9900', 'RT')
reg(['internet gateway', 'igw'], null, 'FF9900', 'IGW')
reg(['nat gateway', 'nat'], null, 'FF9900', 'NAT')
reg(['security group', 'security groups'], null, 'FF9900', 'SG')
reg(['load balancer', 'load balancing', 'alb', 'nlb'], null, '6366F1', 'LB')
reg(['cdn'], 'cloudflare', 'F38020', 'CDN')
reg(['firewall'], 'pfsense', '212121', 'FW')
reg(['proxy'], 'nginx', '009639', 'Proxy')

/* ============================================================
   BLOCKCHAIN
   ============================================================ */
reg(['ethereum'], 'ethereum', '3C3C3D', 'ETH')
reg(['bitcoin'], 'bitcoin', 'F7931A', 'BTC')
reg(['solana'], 'solana', '9945FF', 'SOL')
reg(['polygon'], 'polygon', '7B3FE4', 'MATIC')
reg(['web3', 'web3.js'], 'web3dotjs', 'F16822', 'W3')
reg(['ipfs'], 'ipfs', '65C2CB', 'IPFS')

/* ============================================================
   GAME DEV
   ============================================================ */
reg(['unity'], 'unity', 'FFFFFF', 'Unity')
reg(['unreal', 'unreal engine'], 'unrealengine', '0E1128', 'UE')
reg(['godot'], 'godotengine', '478CBF', 'Godot')
reg(['gamemaker'], 'gamemaker', '000000', 'GM')

/* ============================================================
   SEO / MARKETING
   ============================================================ */
reg(['seo'], 'googlesearchconsole', '458CF5', 'SEO')
reg(['google analytics', 'ga'], 'googleanalytics', 'E37400', 'GA')
reg(['gtm', 'google tag manager'], 'googletagmanager', '246FDB', 'GTM')
reg(['mixpanel'], 'mixpanel', '7856FF', 'MP')
reg(['amplitude'], 'amplitude', '1E61F0', 'Amp')
reg(['hotjar'], 'hotjar', 'FD3A5C', 'HJ')
reg(['segment'], 'segment', '52BD95', 'Seg')
reg(['mailchimp'], 'mailchimp', 'FFE01B', 'MC')
reg(['hubspot'], 'hubspot', 'FF7A59', 'HS')
reg(['salesforce'], 'salesforce', '00A1E0', 'SF')

/* ============================================================
   CONCEPTS / MISC
   ============================================================ */
reg(['application deployment', 'deployment'], null, '6366F1', 'DEP')
reg(['ci/cd', 'cicd', 'ci cd'], 'githubactions', '2088FF', 'CI/CD')
reg(['unit testing', 'unit test'], 'jest', 'C21325', 'UT')
reg(['integration testing'], null, '6366F1', 'IT')
reg(['agile'], null, '6366F1', 'Agile')
reg(['scrum'], 'scrumalliance', '009FDA', 'Scrum')
reg(['kanban'], null, '6366F1', 'Kanban')
reg(['devops'], 'devdotto', '0A0A0A', 'DevOps')
reg(['sre'], null, '6366F1', 'SRE')
reg(['mlops'], null, '6366F1', 'MLOps')
reg(['data science'], 'jupyter', 'F37626', 'DS')
reg(['data engineering'], null, '6366F1', 'DE')
reg(['data analysis'], null, '6366F1', 'DA')
reg(['business intelligence', 'bi'], null, '6366F1', 'BI')
reg(['etl'], null, '6366F1', 'ETL')
reg(['web scraping', 'scraping'], 'scrapy', '60A839', 'Scrape')
reg(['scrapy'], 'scrapy', '60A839', 'Scrapy')
reg(['oop'], null, '6366F1', 'OOP')
reg(['functional programming', 'fp'], null, '6366F1', 'FP')
reg(['dsa', 'data structures'], null, '6366F1', 'DSA')
reg(['algorithms'], null, '6366F1', 'Algo')
reg(['system design'], null, '6366F1', 'SysD')
reg(['design patterns'], null, '6366F1', 'DP')
reg(['microfrontend', 'micro frontend'], null, '6366F1', 'MFE')
reg(['pwa', 'progressive web app'], 'pwa', '5A0FC8', 'PWA')
reg(['spa', 'single page app'], null, '6366F1', 'SPA')
reg(['ssr', 'server side rendering'], 'nextdotjs', 'FFFFFF', 'SSR')
reg(['ssg', 'static site generation'], 'nextdotjs', 'FFFFFF', 'SSG')
reg(['jamstack'], 'jamstack', 'F0047F', 'JAM')

/* ============================================================
   SORTED KEYS
   ============================================================ */
const SORTED_KEYS = Object.keys(M).sort((a, b) => b.length - a.length)

export function getSkillIcon(name) {
  const key = String(name || '').toLowerCase().trim()
  if (!key) return null
  if (M[key]) return M[key]
  for (const k of SORTED_KEYS) {
    if (k.length < 2) continue
    if (key.includes(k)) return M[k]
  }
  return null
}

/* ============================================================
   HASH — deterministic color for fallbacks
   ============================================================ */
function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const FALLBACK_COLORS = [
  ['#6366f1', '#a855f7'],
  ['#06b6d4', '#0ea5e9'],
  ['#f59e0b', '#ea580c'],
  ['#10b981', '#059669'],
  ['#ec4899', '#db2777'],
  ['#8b5cf6', '#7c3aed'],
  ['#ef4444', '#dc2626'],
  ['#14b8a6', '#0d9488'],
]

/* ============================================================
   SKILL LOGO COMPONENT — pure React, no DOM manipulation
   ============================================================ */
export function SkillLogo({ name, size = 20 }) {
  const icon = getSkillIcon(name)

  /* ---- Real logo (SimpleIcons CDN) ---- */
  if (icon && icon.slug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className="skill-logo-img"
        onError={(e) => {
          e.target.style.display = 'none'
          const sib = e.target.nextSibling
          if (sib) sib.style.display = 'inline-flex'
        }}
      />
    )
  }

  /* ---- Text badge with icon color (no slug) ---- */
  if (icon && !icon.slug) {
    const color = icon.color || '6366F1'
    return (
      <span
        className="skill-logo-fallback"
        style={{
          width: size, height: size,
          fontSize: Math.max(8, Math.round(size * 0.36)),
          lineHeight: `${size}px`,
          background: `linear-gradient(135deg, #${color}, #${color}bb)`,
          color: '#fff',
        }}
        title={name}
      >
        {icon.label || '?'}
      </span>
    )
  }

  /* ---- Unknown — deterministic colored initials ---- */
  const initials = String(name || '?')
    .trim()
    .split(/[\s&+._-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const pair = FALLBACK_COLORS[hashCode(name || '?') % FALLBACK_COLORS.length]

  return (
    <span
      className="skill-logo-fallback"
      style={{
        width: size, height: size,
        fontSize: Math.max(9, Math.round(size * 0.42)),
        lineHeight: `${size}px`,
        background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
        color: '#fff',
      }}
      title={name}
    >
      {initials}
    </span>
  )
}